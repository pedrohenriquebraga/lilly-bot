module.exports = {
    name: 'say',
    description: 'Diz a mensagem',
    args: true,
    usage: '``$say <mensagem>``',
    guildOnly: false,
    aliases: ['diga', 'fale', 'repita', 'repeat', 'speak'],
    execute(msg, args) {
        return msg.channel.send(args.join(' '))
    }
}