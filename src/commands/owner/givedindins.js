const members = require("../../controllers/membersController");
const numberConverter = require('../../../utils/numberConverter')

module.exports = {
    name: 'givedindins',
    description: 'Dá DinDins para algum usuário',
    args: true,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Ser dono da Lilly ou Administrador dela',
    lillyPermissions: 'Nenhuma',
    aliases: ['givedd'],
    usage: '$givedindins (usuário) (qtd.)',
    async execute(msg, args, bot) {
        if (msg.author.id !== '374303268068655107')
            return msg.reply('**Ei, só meu o meu criador pode usar este comando!!**')
        
        let user
        try { user = await bot.users.fetch(args.shift()) } 
        catch { user = msg.mentions.users.first() }

        if (!user)
            return msg.reply('**Não consegui achar este usuário!!**')

        if (!args[0]) {
            return msg.reply('**Informe o quanto de DinDins você quer dar!!**')
        }

        try {
            let amount = numberConverter(args[0])
            if (amount) {
                const userId = user.id
                await members.addDinDins(userId, amount)
                return msg.reply('**Você deu a `' + user.username + '` ' + amount + ' DinDins!!**')
            }
        } catch (err) {
            console.error('Erro ao dar dinheiro a alguém: \n',err)
        }
    }
}