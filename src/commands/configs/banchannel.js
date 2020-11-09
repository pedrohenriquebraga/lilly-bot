const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'banchannel',
    description: 'Define um canal onde a Lilly enviará mensagens de banimento.',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Gerenciar o servidor ou Administrador',
    lillyPermissions: 'Nenhuma',
    aliases: ['setbanchannel', 'banchannel', 'canalban'],
    usage: '$banchannel <?canal>',
    async execute(msg, args, bot) {
        const userPermission = msg.member.hasPermission("MANAGER_GUILD") || msg.member.hasPermission("ADMINISTRATOR")
        let banChannelId

        try { banChannelId = msg.mentions.channels.array().shift().id }
        catch { banChannelId = msg.channel.id }

        if (!userPermission) return msg.reply('**Você não tem permissão de alterar o canal de banimentos!!**')

        if (!banChannelId) return msg.reply('**Informe um canal válido para definir como meu canal de banimentos!!**')

        const guild = await guilds.indexGuild(msg.guild.id)
        const currentBanChannel = guild.banChannel

        if (currentBanChannel != banChannelId) {
            await guilds.updateDataGuild({ guildId: msg.guild.id }, { banChannel: banChannelId })
            return msg.reply(`**Canal de banimentos alterado para <#${banChannelId}>**`)
        }
        else return msg.reply(`**O canal <#${banChannelId}> já está definido como meu canal de banimentos!!**`)
    }
}