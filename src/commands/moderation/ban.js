const guildsController = require('../../controllers/guildsController')

module.exports = {
    name: 'ban',
    description: 'Bani um usuário do servidor',
    args: true,
    guildOnly: true,
    userPermissions: 'Banir Usuários ou Administrador',
    lillyPermissions: 'Banir Usuários',
    aliases: ['banir', 'punir'],
    usage: '$ban (membro) (?dias(0 = para sempre)) (?motivo)',
    async execute(msg, args, bot) {
        const firstArg = args.shift()
            .split('')
            .filter(num => (Number(num) || num == 0)).join('')

        const guild = await guildsController.indexGuild(msg.guild.id)
        const banMember = msg.mentions.members.first() || await bot.users.fetch(firstArg)

        const author = msg.member
        const authorPermission = author.hasPermission("BAN_MEMBERS") || author.hasPermission("ADMINISTRATOR")
        const days = parseInt(args.shift()) || null
        const reason = args.join(" ") || '<< Motivo Desconhecido >>'

        if (!banMember) {
            return msg.reply('Mencione um usuário ou informe seu ID válido para ser banido!')
        }

        if (!banMember.bannable) {
            return msg.reply('Não é possível banir este usuário!! **Lembre-se que eu preciso ter permissão de banir usuários ou de administrador!!**')
        }

        if (!authorPermission) {
            return msg.reply('Você não tem permissão de banir usuários!')

        }

        let banChannel = await msg.guild.channels.cache.get(guild.banChannel) || msg.channel

        banChannel.send(`🚫 | **O usuário ${banMember} foi banido por ${msg.author}**\n` + '**📨 | Motivo:** `' + reason + '`\n' + `**🕒 | Tempo(dias):** ${days || 'Indeterminado'}`)
        return banMember.ban({ days: days, reason: reason })
    }
}
