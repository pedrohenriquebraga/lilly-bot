const mongoose = require('mongoose')


// Criando Schema

const MembersSchema = new mongoose.Schema({
    memberId: {
        type: String,
        required: true,
        unique: true
    },
    money: {
        type: Number,
        default: 0,
        min: 0
    },
    specialMoney: {
        type: Number,
        default: 0,
        min: 0
    },
    multiplierMoney: {
        type: Number,
        default: 1,
        min: 1
    },
    premium: {
        type: Boolean,
        default: false
    }
    ,
    lillyBan: {
        type: Boolean,
        default: false
    }
})

mongoose.model('Member', MembersSchema)