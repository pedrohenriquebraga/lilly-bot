module.exports = {
    name: 'say',
    description: 'Diz a mensagem',
    args: true,
    usage: '``$say <mensagem>``',
    guildOnly: false,
    aliases: ['diga', 'fale', 'repita', 'repeat', 'speak'],
    execute(message, args) {
        return message.channel.send(args.join(' '))
    }
}