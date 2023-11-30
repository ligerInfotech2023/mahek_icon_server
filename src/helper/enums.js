module.exports ={
    Status:{
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        DELETED: 'deleted'
    },
    Roles: {
        SUPERADMIN: 'superadmin',
        ADMIN: 'admin',
        USER: 'user'
    },
    Permission: {
        ALL: "all",
        MANAGE_USER: "manage_user",
        READ_ONLY: "read_only",
    },
    SquareRateType:{
        Member_Fee:'member_fee',
        Maintenance_Amount: 'maintenance_amount',
        Transfer_Fee:'transfer_fee',
        Share_Capital: 'share_capital',
        Land_Amount_Fund: 'land_amount_fund',
        Construction_Fund: 'construction_fund',
        N_A_Conversion_amount: 'n_a_conversion_amount',
        Deposit: 'deposit'
    },
    PaymentType:{
        NEFT: 'neft',
        CHEQUE: 'cheque', 
        CASH: 'cash',
        UPI: 'upi'
    }
}