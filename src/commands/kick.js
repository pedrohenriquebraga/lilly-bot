module.exports = {
    name: 'kick',
    description: 'Expulsa um usuário do servidor',
    args: true,
    guildOnly: true,
    aliases: ['expulsar'],
    usage: '`$kick <membro> <?motivo>`',
    execute(msg, args) {
        const kickMember = msg.mentions.members.first() || args[0]
        const author = msg.member
        const authorPermission = author.hasPermission("KICK_MEMBERS") || author.hasPermission("ADMINISTRATOR")
        const reason = args[1] || '<< Motivo Desconhecido >>'

        if (!kickMember) {
            return msg.reply('Mencione um usuário ou informe seu ID válido para ser expulso!')
        }

        if (!kickMember.kickable) {
            return msg.reply('Não é possível expulsar este usuário!')
        }

        if (!authorPermission) {
            return msg.reply('Você não tem permissão de expulsar usuários!')
        }

        kickMember.kick({ reason: reason })
        return msg.channel.send(`**🦶 | O usuário ${kickMember} foi expulso por ${msg.author}**\n` + '**📨 | Motivo: **`' + reason + '`')
    }
}