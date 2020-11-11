module.exports = {
    name: 'ping',
    description: 'Mostra o ping da Lilly e da API do Discord',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    aliases: [],
    usage: '$ping',
    async execute(msg, args, bot) {
        const m = await msg.reply('...')

        const pingEmbed = {
            title: '🏓 Pong!',
            description: `A latência é de **${m.createdTimestamp - msg.createdTimestamp}ms**.\nA latência da API é **${Math.round(bot.ws.ping)}ms**.`,
        } 

        m.edit(msg.author, {embed: pingEmbed})
    }
}