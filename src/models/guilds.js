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
            message: 'Seja bem-vindo {@user}',
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

    messageProtector: {
        type: Object,
        default: {
            isActive: false,
            antiInvite: false,
            antiLink: false,
            antiMassUserMention: false,
            antiMassChannelMention: false,
            antiMassRoleMention: false,
            logChannel: '',
            allowedLinksChannelsId: [],
            allowedInvitesChannelsId: [],
            allowedUsersId: [],
            allowedLinksUsersId: [],
            allowedRolesId: [],
            allowedLinksRolesId: [],
            allowedMsgFiltersUser: [],
            deniedWords: [],
            deniedMessages: [],
            toleranceDeniedWords: 1,
            maxLengthMessage: 2000,
            maxUsersMentions: 5,
            maxChannelsMentions: 5,
            maxRolesMentions: 5
        },
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