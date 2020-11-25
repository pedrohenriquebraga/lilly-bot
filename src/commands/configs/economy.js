const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'economy',
    description: 'Habilita ou desabilita os comandos de economia do servidor',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Gerenciar o servidor ou Administrador',
    lillyPermissions: 'Nenhuma',
    aliases: ['economia', 'eco'],
    usage: '$economia',
    async execute(msg, args) {
        const userPermission = msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")

        if (!userPermission) return msg.reply('Você não pode habilitar/desabilitar os comandos de economia')
        let guildEconomyPermission = await guilds.indexGuild(msg.guild.id)

        if (guildEconomyPermission.economy == undefined) 
            guildEconomyPermission.economy = false

        switch (guildEconomyPermission.economy) {
            case true:
                await guilds.updateDataGuild({ guildId: msg.guild.id }, { economy: false })
                return msg.reply('Foi desabilitado todos os comandos de economia!!')
            case false:
                await guilds.updateDataGuild({ guildId: msg.guild.id }, { economy: true })
                return msg.reply('Foi habilitado todos os comandos de economia!!')
            default:
                return msg.reply('Não foi possível fazer a alteração nos comandos de economia!!')
        }
    }
}