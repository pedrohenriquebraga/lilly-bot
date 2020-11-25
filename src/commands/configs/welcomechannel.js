const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'welcomechannel',
    description: 'Define um canal de boas-vindas',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Gerenciar o servidor',
    lillyPermissions: 'Nenhuma',
    aliases: ['setwelcomechannel', 'wcchannel', 'canalbemvindo'],
    usage: '$commandchannel (?canal)',
    async execute(msg, args) {
        const userPermission = msg.member.hasPermission("MANAGER_GUILD") || msg.member.hasPermission("ADMINISTRATOR")
        let welcomeChannelId

        try { welcomeChannelId = msg.mentions.channels.array().shift().id }
        catch { welcomeChannelId = msg.channel.id }

        if (!userPermission) return msg.reply('**Você não tem permissão de alterar o canal de boas-vindas!!**')

        if (!welcomeChannelId) return msg.reply('**Informe um canal válido para definir como meu canal de boas-vindas!!**')

        const guild = await guilds.indexGuild(msg.guild.id)
        const currentWelcomeChannel = guild.welcomeConfig.channel

        if (currentWelcomeChannel != welcomeChannelId) {
            await guilds.updateDataGuild({ guildId: msg.guild.id }, { "welcomeConfig.channel": welcomeChannelId })
            return msg.reply(`**Canal de boas-vindas alterado para <#${welcomeChannelId}>**`)
        }
        else return msg.reply(`**O canal <#${welcomeChannelId}> já está definido como meu canal de boas-vindas!!**`)
    }
}