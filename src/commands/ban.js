module.exports = {
    name: 'ban',
    description: 'Bani um usuário do servidor',
    args: true,
    guildOnly: true,
    aliases: ['banir', 'punir'],
    usage: '`$ban <membro> <?dias> <?motivo>`',
    execute(msg, args) {
        const banMember = msg.mentions.members.first() || args[0]
        const author = msg.member
        const authorPermission = author.hasPermission("BAN_MEMBERS") || author.hasPermission("ADMINISTRATOR")
        const days = parseInt(args[1]) || null
        const reason = args[2] || '<< Motivo Desconhecido >>'

        if (!banMember) {
            return msg.reply('Mencione um usuário ou informe seu ID válido para ser banido!')
        }

        if (!banMember.bannable) {
            return msg.reply('Não é possível banir este usuário!!')
        }

        if (!authorPermission) {
            return msg.reply('Você não tem permissão de banir usuários!')
        }

        banMember.ban({ days: days, reason: reason })
        return msg.channel.send(`🚫 | **O usuário ${banMember} foi banido por ${msg.author}**\n` + '**📨 | Motivo:** `' + reason + '`\n' + `**🕒 | Tempo(dias):** ${days || 'Indeterminado'}`)
    }
}