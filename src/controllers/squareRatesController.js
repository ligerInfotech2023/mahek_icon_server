const moment = require('moment')
const errorMessage = require("../utils/errorMessage");
const { SquareRateType, Roles, Permission } = require('../helper/enums');
const { SquareRateSchema } = require('../models');
const successMessage = require('../utils/successMessage');
const { checkPermission, getPagination, generateName } = require('../helper/utils');


const addSquareRates = async(req, res, next) => {
    try{
        if(!await checkPermission(Roles.SUPERADMIN, Permission.ALL, req.user)){
            return res.status(401).send({status:false, message: errorMessage.PERMISSION_DENIED})
        }
        const {select_type, sqft_rate, effective_start_date, effective_end_date, collection_start_date, collection_end_date} = req.body;

        const name = await generateName(select_type, effective_start_date)
        const effectiveStartDate = moment(effective_start_date).format('YYYY-MM-DD') //new Date(effective_start_date)
        const effectiveEndDate = moment(effective_end_date).format('YYYY-MM-DD')   //new Date(effective_end_date)
        const collectionStartDate = moment(collection_start_date).format('YYYY-MM-DD') //new Date(collection_start_date)
        const collectionEndDate = moment(collection_end_date).format('YYYY-MM-DD') //new Date(collection_end_date)
        
        //Parse sqft_rate as a number
        const parsedSqftRate = parseFloat(sqft_rate)

        if(isNaN(parsedSqftRate)){
            return res.status(400).json({ status: false, message: 'Invalid sqft_rate value' });
        }
        let IndRupees = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency:"INR"
        })
        const formatedSqrtRate = IndRupees.format(parsedSqftRate)

        const newSquareRates = {
            name: name,
            select_type: select_type,
            sqft_rate: parsedSqftRate ,//`${sqft_rate}₹`,
            effective_start_date: effectiveStartDate,
            effective_end_date: effectiveEndDate,
            collection_start_date: select_type === SquareRateType.Maintenance_Amount ? collectionStartDate : null,
            collection_end_date: select_type === SquareRateType.Maintenance_Amount ? collectionEndDate : null
        }

        const addSquareRate = await SquareRateSchema.create(newSquareRates)
        if(!addSquareRate){
            return res.status(403).json({status:false, message: errorMessage.ERR_CREATE})
        }
        const responseObject = {
            name: addSquareRate.name,
            select_type: addSquareRate.select_type,
            sqft_rate: formatedSqrtRate,
            effective_start_date: addSquareRate.effective_start_date,
            effective_end_date: addSquareRate.effective_end_date,
            collection_start_date: addSquareRate.collection_start_date,
            collection_end_date: addSquareRate.collection_end_date
        }
        if(addSquareRate.select_type !== SquareRateType.Maintenance_Amount){
           delete responseObject.collection_start_date
           delete responseObject.collection_end_date
        }
        return res.status(200).json({status:true, message: successMessage.SUCCESS_CREATE,data: responseObject})

    }catch(err){
        console.log('Error while adding square rates-> ',err);
        return res.status(500).json({status:false, message:errorMessage.INTERNAL_SERVER_ERROR, error:err.message})
    }
}

const getSquareListByTypes = async(req, res, next) => {
    try{
        const {type, year, page, size} = req.query;
        const {limit, offset} = getPagination(page, size)
        let findQuery = {}

        if(type){
            findQuery.select_type = type;
        }
        if(year){
            const yeartoSearch = new Date(year)
            const yearStartDate = new Date(yeartoSearch.getFullYear(), 0,1);
            const yearEndDate = new Date(yeartoSearch.getFullYear() + 1, 0, 1)
            
            findQuery.effective_start_date = {
                $gte: yearStartDate,
                $lt: yearEndDate
            }
        }

        const squareRateData = await SquareRateSchema.find(findQuery).select('-__v').skip(offset).limit(limit).exec()
        if(!squareRateData || squareRateData.length === 0){
            return res.status(404).json({status:false, message: errorMessage.NO_DATA})
        }
        const responseData = squareRateData.map(item => ({
            ...item._doc,
            sqft_rate: item.sqft_rate,
            
        }))
        return res.status(200).json({status:true, message: successMessage.FETCH_SUCCESS, data: responseData})
    }catch(err){
        console.log('Error while get square list-> ',err);
        return res.status(500).json({status:false, message: errorMessage.INTERNAL_SERVER_ERROR, error: err.message})
    }
}

module.exports = {addSquareRates, getSquareListByTypes}