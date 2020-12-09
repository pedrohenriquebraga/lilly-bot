const mongoose = require('mongoose')

// Criando Schema

const GuildsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    guildPrefix: {
        type: String,
        default: '$',
        minlength: 1,
        maxlength: 10
    },
    economy: {
        type: Boolean,
        default: true
    },
    autoroles: {
        type: Array
    },
    changeColor: {
        type: Boolean,
        default: true
    },
    economyChannel: {
        type: String,
        default: ''
    },
    welcomeConfig: {
        type: Object,
        default: {
            isActive: true,
            message: '',
            channel: ''
        }
    },
    commandChannel: {
        type: String,
        default: ''
    },
    commandsConfig: {
        type: Object,
        default: {
            warnUnkCommand: false,
            delMsgCommand: false
        }
    },
    banChannel: {
        type: String,
        default: ''
    },
    premium: {
        type: Boolean,
        default: false
    },
    globalMembersBan: {
        type: Boolean,
        default: true,
        aliases: ['lct']
    },
    lillyBan: {
        type: Boolean,
        default: false
    }
})

mongoose.model('Guild', GuildsSchema)