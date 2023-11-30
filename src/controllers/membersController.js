const { Permission, Roles } = require("../helper/enums");
const { checkPermission, getPagination, manageSorting } = require("../helper/utils");
const { MemberSchema } = require("../models");
const errorMessage = require("../utils/errorMessage");
const successMessage = require("../utils/successMessage");

const addNewMember = async(req, res, next) => {
    try{
        const body = req.body;
        if(!await checkPermission(Roles.SUPERADMIN, Permission.ALL, req.user)){
            return res.status(401).send({status:false, message: errorMessage.PERMISSION_DENIED})
        }

        const existMember = await MemberSchema.find({shop_number: body.shop_number})

        if(existMember.length > 0){
            return res.status(403).json({status:false, message: errorMessage.MEMBER_EXISTS})
        } else{

            const newMember = {
                shop_number: body && body.shop_number ? body.shop_number : null, 
                owner_name_1 : body && body.owner_name_1 ? body.owner_name_1 : null,
                owner_name_2:body && body.owner_name_2 ? body.owner_name_2 : null,
                email: body && body.email ? body.email : null, 
                contact_number_1: body && body.contact_number_1 ? body.contact_number_1 : null,
                contact_number_2: body && body.contact_number_2 ? body.contact_number_2 : null,
                member_fee: body && body.member_fee ? body.member_fee : 0,
                pending_member_fee: body && body.pending_member_fee ? body.pending_member_fee : 0,
                maintenance: body && body.maintenance ? body.maintenance : 0,
                pending_maintenance: body && body.pending_maintenance ? body.pending_maintenance : 0,
                transfer_fee: body && body.transfer_fee ? body.transfer_fee : 0,
                pending_transfer_fee: body && body.pending_transfer_fee ? body.pending_transfer_fee : 0,
                share_capital: body && body.share_capital ? body.share_capital : 0,
                pending_share_capital: body && body.pending_share_capital ? body.pending_share_capital : 0,
                land_amount: body && body.land_amount ? body.land_amount : 0,
                pending_land_amount: body && body.pending_land_amount ? body.pending_land_amount : 0,
                construction_fund: body && body.construction_fund ? body.construction_fund : 0,
                pending_construction_fund: body && body.pending_construction_fund ? body.pending_construction_fund : 0,
                n_a_conversion_amount: body && body.n_a_conversion_amount ? body.n_a_conversion_amount : 0,
                pending_n_a_conversion_amount: body && body.pending_n_a_conversion_amount ? body.pending_n_a_conversion_amount : 0,
                deposit: body && body.deposit ? body.deposit : 0,
                pending_deposit: body && body.pending_deposit ? body.pending_deposit : 0,
            }
            
            const shopSize = body && body.shop_size ? body.shop_size.replace('*','×') : null;
            const widthAndHeight = shopSize.split('×')
            const width = widthAndHeight[0]
            const height = widthAndHeight[1]
            const totalShopSize = width * height
            const TotalShopSize = totalShopSize.toFixed(2)

            newMember.shop_size = body && body.shop_size ? shopSize : null;
            newMember.total_shop_size = newMember.shop_size ? `${TotalShopSize} ft` : null;

            const saveNewMember = await MemberSchema.create(newMember)
            if(saveNewMember){
                res.status(200).json({status:true, message: successMessage.SUCCESS_CREATE, data: saveNewMember})
            } else{
                res.status(403).json({status:false, message: errorMessage.ERR_CREATE})
            }
        }

    }catch(err){
        console.log('Error while add new member ->: ',err);
        return res.status(500).json({status:false, message: errorMessage.INTERNAL_SERVER_ERROR, error:err.message})
    }
}

const editExistingMember = async(req, res, next) => {
    try{
        const {id} = req.params;
        const body = req.body;

        if(!await checkPermission(Roles.SUPERADMIN, Permission.ALL, req.user)){
            return res.status(401).send({status:false, message: errorMessage.PERMISSION_DENIED})
        }
        const findMember = await MemberSchema.findOne({_id:id})
        if(!findMember || findMember.length === 0){
            return res.status(400).send({status:false, message: errorMessage.MEMBER_NOT_FOUND})
        }else{
            const updateObject = {
                shop_number: body && body.shop_number ? body.shop_number : null, 
                owner_name_1 : body && body.owner_name_1 ? body.owner_name_1 : null,
                owner_name_2:body && body.owner_name_2 ? body.owner_name_2 : null,
                email: body && body.email ? body.email : null, 
                contact_number_1: body && body.contact_number_1 ? body.contact_number_1 : null,
                contact_number_2: body && body.contact_number_2 ? body.contact_number_2 : null,
                member_fee: body && body.member_fee ? body.member_fee : 0,
                pending_member_fee: body && body.pending_member_fee ? body.pending_member_fee : 0,
                maintenance: body && body.maintenance ? body.maintenance : 0,
                pending_maintenance: body && body.pending_maintenance ? body.pending_maintenance : 0,
                transfer_fee: body && body.transfer_fee ? body.transfer_fee : 0,
                pending_transfer_fee: body && body.pending_transfer_fee ? body.pending_transfer_fee : 0,
                share_capital: body && body.share_capital ? body.share_capital : 0,
                pending_share_capital: body && body.pending_share_capital ? body.pending_share_capital : 0,
                land_amount: body && body.land_amount ? body.land_amount : 0,
                pending_land_amount: body && body.pending_land_amount ? body.pending_land_amount : 0,
                construction_fund: body && body.construction_fund ? body.construction_fund : 0,
                pending_construction_fund: body && body.pending_construction_fund ? body.pending_construction_fund : 0,
                n_a_conversion_amount: body && body.n_a_conversion_amount ? body.n_a_conversion_amount : 0,
                pending_n_a_conversion_amount: body && body.pending_n_a_conversion_amount ? body.pending_n_a_conversion_amount : 0,
                deposit: body && body.deposit ? body.deposit : 0,
                pending_deposit: body && body.pending_deposit ? body.pending_deposit : 0,
            }

            const shopSize = body && body.shop_size ? body.shop_size.replace('*','×') : null
            const widthAndHeight = shopSize.split('×')
            const width = widthAndHeight[0]
            const height = widthAndHeight[1]
            const totalShopSize = width * height
            const TotalShopSize = totalShopSize.toFixed(2)

            updateObject.shop_size = body && body.shop_size ? shopSize : null;
            updateObject.total_shop_size = body.shop_size ? `${TotalShopSize} ft`: null;
            const updateMember = await MemberSchema.updateOne({_id: findMember._id}, updateObject)

            if(updateMember.modifiedCount === 0){
                return res.status(402).json({status:false, message: errorMessage.UPDATE_FAILED})
            }
            res.status(200).json({status:true, message: successMessage.UPDATE_SUCCESS})
        }

    }catch(err){
        console.log('Error while edit member ->: ',err);
        return res.status(500).json({status:false, message: errorMessage.INTERNAL_SERVER_ERROR, error:err.message})
    }
}

const showMemberList = async(req, res, next) => {
    try{
        const {search, sort, key, page, size} = req.query;
        const {limit, offset} = getPagination(page, size)
        let findQuery = {}

        if(search){
               const fieldsToSearch = [
                'shop_number',
                'owner_name_1',
                'owner_name_2',
                'email',
                'shop_size'
               ]

               let newSearchString;

               if(search.includes('*')){
                    newSearchString = search.replace('*', '×')
               }
               const orCondition = fieldsToSearch.map(field => ({
                    [field]: field === 'shop_size' ? newSearchString : {$regex: new RegExp(search, 'i')}
               }));

               
               if(!isNaN(search)){
                fieldsToSearch.push('contact_number_1', 'contact_number_2', 'shop_size');
                orCondition.push(
                    {contact_number_1: Number(search)},
                    {contact_number_2: Number(search)},
                    {shop_size: new RegExp(search, 'i')}    
                )
               }

               const dateToSearch = new Date(search);
               if(!isNaN(dateToSearch.getTime())){
                    orCondition.push({
                        created_date: {$gte: dateToSearch.setHours(0, 0, 0, 0), $lte: dateToSearch.setHours(23,59,59,999)},
                        updated_date: {$gte: dateToSearch.setHours(0,0,0,0), $lte:dateToSearch.setHours(23,59,59,999)}
                    })
               }
               findQuery = {$or: orCondition};
           
        }
        let sortOptions
        if(key && sort){
            sortOptions = await manageSorting(key,sort)
        }

        const findMember = await MemberSchema.find(findQuery).sort(sortOptions).skip(offset).limit(limit).select('-__v').exec()
        if(!findMember || findMember.length === 0){
            return res.status(404).json({status:false, message: errorMessage.NO_DATA})
        }
        res.status(200).json({status:true, message:successMessage.FETCH_SUCCESS, data: findMember})

    }catch(err){
        console.log('Error while show member list-> ',err);
        return res.status(500).json({status:false, message: errorMessage.INTERNAL_SERVER_ERROR, error: err.message})
    }
}

const showOneMember = async(req, res, next) => {
    try{
        const { id } = req.params;

        const findMember = await MemberSchema.findOne({_id:id}).select('-__v')
        if(!findMember || findMember.length === 0){
            return res.status(404).json({status:false, message:errorMessage.MEMBER_NOT_FOUND})
        }
        return res.status(200).json({status:true, message: successMessage.FETCH_SUCCESS, data:findMember})
    }catch(err){
        console.log('Error while show one member-> ',err);
        return res.status(500).json({status:false, message: errorMessage.INTERNAL_SERVER_ERROR, error: err.message})
    }
}

module.exports = {addNewMember,editExistingMember, showMemberList, showOneMember}