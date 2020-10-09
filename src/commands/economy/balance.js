const members = require('../../controllers/membersController')

module.exports = {
    name: 'balance',
    description: 'Mostra seu saldo de DinDins',
    args: false,
    guildOnly: true,
    economy: true,
    premium: false,
    userPermissions: '',
    lillyPermissions: '',
    aliases: ['saldo'],
    usage: '$balance',
    async execute(msg, args) {
        const member = await members.indexMember(msg.author.id)
        if (member) return msg.reply(`**💸 | Você possuí ${member['money']} DinDins e ${member['specialMoney']} Halitas!**`)

        return msg.reply('**Não consegui mostrar seu saldo, tente mais tarde!!**')
    }
}