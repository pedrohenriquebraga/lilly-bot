const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'banchannel',
    description: 'Define um canal onde a Lilly enviará mensagens de banimento.',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Gerenciar o servidor',
    lillyPermissions: 'Nenhuma',
    aliases: ['setbanchannel', 'banchannel', 'canalban'],
    usage: '$banchannel <?canal>',
    async execute(msg, args, bot) {
        const userPermission = msg.member.hasPermission("MANAGER_GUILD") || msg.member.hasPermission("ADMINISTRATOR")
        const banChannelId = msg.mentions.channels.array().shift() || msg.channel.id

        if (!userPermission) return msg.reply('**Você não tem permissão de alterar o canal de banimentos!!**')

        if (!banChannelId) return msg.reply('**Informe um canal válido para definir como meu canal de banimentos!!**')

        const guild = await guilds.indexGuild(msg.guild.id)
        const currentBanChannel = guild.banChannel

        if (currentBanChannel != banChannelId) {
            await guilds.updateDataGuild({ guildId: msg.guild.id }, { banChannel: banChannelId.id })
            return msg.reply(`**Canal de banimentos alterado para <#${banChannelId.id}>**`)
        }
        else return msg.reply(`**O canal <#${banChannelId.id}> já está definido como meu canal de banimentos!!**`)
    }
}