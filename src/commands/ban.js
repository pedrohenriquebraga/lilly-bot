module.exports = {
    name: 'ban',
    description: 'Bani um usuário do servidor',
    args: true,
    guildOnly: true,
    aliases: ['banir', 'punir'],
    usage: '`$ban <membro> <?dias> <?motivo>`',
    execute(msg, args) {
        const firstArg = args.shift()
        const banMember = msg.mentions.members.first() || firstArg
        const author = msg.member
        const authorPermission = author.hasPermission("BAN_MEMBERS") || author.hasPermission("ADMINISTRATOR")
        const days = parseInt(args.shift()) || null
        const reason = args.join(" ") || '<< Motivo Desconhecido >>'

        if (!banMember) {
            return msg.reply('Mencione um usuário ou informe seu ID válido para ser banido!')
        }

        if (!banMember.bannable) {
            return msg.reply('Não é possível banir este usuário!!')
        }

        if (!authorPermission) {
            return msg.reply('Você não tem permissão de banir usuários!')
        }

        msg.channel.send(`🚫 | **O usuário ${banMember} foi banido por ${msg.author}**\n` + '**📨 | Motivo:** `' + reason + '`\n' + `**🕒 | Tempo(dias):** ${days || 'Indeterminado'}`)
        return banMember.ban({ days: days, reason: reason })
    }
}
