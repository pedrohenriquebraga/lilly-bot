module.exports = {
    name: 'say',
    description: 'Say the message',
    execute(message, args) {
        if (args.length) {
            return message.channel.send(args.join(' '))
        } return message.reply('Você deve informar o que eu devo falar!! ``$say <mensagem>``')
    }
}