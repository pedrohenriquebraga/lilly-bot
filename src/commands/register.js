const mongoose = require('mongoose')
const memberController = require('../controllers/membersController')
const mongoPassword = process.env.MONGO_PASSWORD

process.on('unhandledRejection', error => console.error(error))

mongoose.connect(`mongodb+srv://GameSantos:${mongoPassword}@lilly0.pxy52.gcp.mongodb.net/members?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: 'createIndexes'
})

module.exports = {
    name: 'register',
    description: 'Registra o usuário no DB',
    args: false,
    economy: false,
    guildOnly: true,
    aliases: ['registrar'],
    usage: '``$register``',
    async execute(msg, args) {
        const member = {
            memberId: msg.author.id
        }

        const existMember = await memberController.indexMember(member.memberId)

        if (existMember) {
            return msg.reply('Você já está em meu DB!!')
        }

        memberController.saveMember(member)
    }
}