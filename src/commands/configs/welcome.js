const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'welcome',
    description: 'Ativa ou desativa as boas-vindas',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Gerenciar o Servidor',
    lillyPermissions: 'Nenhuma',
    aliases: ['bemvindo'],
    usage: '$welcome',
    async execute(msg, args) {
        const userPermission = msg.member.hasPermission("ADMINISTRATOR") || 
            msg.member.hasPermission("MANAGE_GUILD")

        if (!userPermission) 
            return msg.reply('**Você não tem permissão de ativar ou desativar as boas-vindas!**')

        const guild = await guilds.indexGuild(msg.guild.id)
        let welcomeIsActive = guild.welcomeConfig.isActive

        if (welcomeIsActive == undefined) welcomeIsActive = true

        switch (welcomeIsActive) {
            case true:
                await guild.updateOne({ "welcomeConfig.isActive": false})
                return msg.reply('**As boas-vindas foram desabilitadas!!**')
            case false:
                await guild.updateOne({ "welcomeConfig.isActive": true})
                return msg.reply('**As boas-vindas foram habilitadas!!**')
            default:
                return msg.reply('Não foi possível fazer a alteração nas boas-vindas!')
        }
    }
}