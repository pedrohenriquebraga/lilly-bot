module.exports = {
    name: 'kick',
    description: 'Expulsa um usuário do servidor',
    args: true,
    guildOnly: true,
    aliases: ['expulsar'],
    usage: '`$kick <membro> <?motivo>`',
    execute(msg, args) {
        const kickMember = msg.mentions.members.first()
        const author = msg.member
        const authorPermission = author.hasPermission("KICK_MEMBERS") || author.hasPermission("ADMINISTRATOR")
        const reason = args[1] || '<< Motivo Desconhecido >>'

        if ( !kickMember.kickable ) {
            return msg.reply('Eu não tenho permissão de expulsar este usuário!')
        }

        if ( authorPermission ) {
            kickMember.kick({ reason: reason })
            return msg.channel.send(`🦶 | O usuário ${kickMember} foi expulso por ${msg.author}\n` + '📨 | Motivo: ' + reason)
        }
    }
}