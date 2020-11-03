module.exports = {
    name: 'lilly',
    description: 'A Lilly se apresenta para quem enviou a mensagem!!',
    guildOnly: false,
    args: false,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    usage: '$lilly',
    aliases: ['whoisyou', 'quemevoce'],
    execute(msg, args) {
        const responses = [
            `Olá ${msg.author}, eu sou a Lilly, um simples bot criado com o objetivo de ajudar a todos!!`,
            `Eae ${msg.author}, como posso te ajudar?`,
            `Me chamou ${msg.author}? Como posso te ajudar?`,
            `Como vai ${msg.author}? Meu nome é Lilly e estou aqui para te ajudar e divertir!!`,
            `Olá ${msg.author}, eu sou a Lilly!!`
        ];

        msg.channel.send(responses[Math.floor(Math.random() * responses.length)])
    }
}