const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'antilink',
    description: 'Ativa ou desativa o antilink da Lilly.',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    fun: false,
    userPermissions: 'Gerenciar o servidor',
    lillyPermissions: 'Nenhuma',
    aliases: ['antilk'],
    usage: '$antilink',
    async execute(msg, args) {
        const userPermission = msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")

        if (!userPermission) return msg.reply('Você não pode ativar ou desativar o antiLink')
        let guild = await guilds.indexGuild(msg.guild.id)

        if (guild.messageProtector.antiLink == undefined) 
            guild.messageProtector.antiLink = false

        switch (guild.messageProtector.antiLink) {
            case true:
                await guild.updateOne({ 'messageProtector.antiLink': false })
                return msg.reply('Foi desativado o antilink da Lilly!!')
            case false:
                await guild.updateOne({ 'messageProtector.antiLink': true })
                return msg.reply('Foi ativado o antilink da Lilly!!')
            default:
                return msg.reply('Não foi possível fazer a alteração no antilink da Lilly!!')
        }
    }
}