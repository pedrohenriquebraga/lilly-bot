module.exports = {
    name: 'gennum',
    description: 'Gera um número aleatório em um intervalo determinado pelo usuário, por padrão é gerado entre 0 e 10.',
    args: false,
    guildOnly: false,
    economy: false,
    premium: false,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    aliases: ['gerarnumero', 'generatenumber'],
    usage: '$gennum (?inicío) (?fim)',
    execute(msg, args) {
        const startNumber = parseInt(args.shift()) || 0
        const endNumber = parseInt(args.shift()) || 10
        const generatedNumber = Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber;

        if (startNumber + endNumber > 100000) return msg.reply('**Eu não consigo pensar em tantos números!!**')

        return msg.reply(`Eu gerei o número **${generatedNumber}**`)
    }
}