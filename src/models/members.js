const mongoose = require('mongoose')

const items = {
    halita: {
        hasMachine: false,
        isActive: false,
        timeActive: 0,
        level: 1
    },
    dindin: {
        hasMachine: false,
        isActive: false,
        timeActive: 0,
        level: 1
    },
}

// Criando Schema
const MembersSchema = new mongoose.Schema({
    memberId: {
        type: String,
        required: true,
        unique: true
    },
    machines: {
        type: Object,
        default: {items}
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
    lottery: {
        type: Object,
        default: {
            isParticipating: false,
            totalBet: 0,
            selectNumbers: []
        }
    },
    lastDaily: {
        type: String,
        default: '',
    },
    premium: {
        type: Boolean,
        default: false
    },
    lillyBan: {
        type: Boolean,
        default: false
    }
})

mongoose.model('Member', MembersSchema)