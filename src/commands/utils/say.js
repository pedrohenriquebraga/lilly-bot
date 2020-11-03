module.exports = {
    name: 'say',
    description: 'Diz uma mensagem que o usuário pedir',
    args: true,
    userPermissions: 'Gerenciar Mensagens ou Administrador',
    lillyPermissions: 'Nenhuma',
    usage: '$say (mensagem)',
    guildOnly: false,
    aliases: ['diga', 'fale', 'repita', 'repeat', 'speak'],
    execute(msg, args) {
        if (msg.member.hasPermission("ADMINISTRATOR") || msg.member.hasPermission("MANAGE_MESSAGES")) {
            return msg.channel.send(args.join(' ') + `\n\n✍ - ${msg.author}`)
        } else {
            return msg.reply('Desculpe, mas você não tem permissão de usar este comando!')
        }
    }
}