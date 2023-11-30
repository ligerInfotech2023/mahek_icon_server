const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
    {
        shop_number:{
            type: String,
            required:true
        },
        owner_name_1:{
            type:String,
            required:true
        },
        owner_name_2:{
            type:String
        },
        email:{
            type: String
        },
        contact_number_1:{
            type:Number,
            required:true
        },
        contact_number_2:{
            type:Number,
        },
        shop_size:{
            type:String,
            required:true
        },
        total_shop_size:{
            type:String
        },
        member_fee:{
            type:Number
        },
        pending_member_fee:{
            type:Number
        },
        maintenance:{
            type:Number
        },
        pending_maintenance:{
            type:Number
        },
        transfer_fee:{
            type:Number
        },
        pending_transfer_fee:{
            type:Number
        },
        share_capital:{
            type:Number
        }, 
        pending_share_capital:{
            type:Number
        },
        land_amount:{
            type:Number
        },
        pending_land_amount:{
            type:Number
        },
        construction_fund:{
            type:Number
        },
        pending_construction_fund:{
            type:Number
        },
        n_a_conversion_amount:{
            type:Number
        },
        pending_n_a_conversion_amount:{
            type:Number
        },
        deposit:{
            type:Number
        },
        pending_deposit:{
            type:Number
        }
    }, 
    {
        collection:"tbl_member",
        timestamps:{
            createdAt:"created_date",
            updatedAt:"updated_date"
        }
    }
);

const MemberSchema = mongoose.model('tbl_member', memberSchema)

module.exports = MemberSchema;