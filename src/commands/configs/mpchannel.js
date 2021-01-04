const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'mpchannel',
    description: 'Define um canal onde a Lilly avisará sobre mensagens excluídas!.',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Gerenciar o servidor',
    lillyPermissions: 'Nenhuma',
    aliases: ['setmpchannel', 'messageprotectorchannel', 'canalmp'],
    usage: '$mpchannel <?canal>',
    async execute(msg, args, bot) {
        const userPermission = msg.member.hasPermission("MANAGER_GUILD") || msg.member.hasPermission("ADMINISTRATOR")
        const mpChannelId = msg.mentions.channels.array().shift() || msg.channel.id

        if (!userPermission) return msg.reply('**Você não tem permissão de alterar o canal de mensagens excluídas!!**')

        if (!mpChannelId) return msg.reply('**Informe um canal válido para definir como meu canal de mensagens excluídas!!**')

        const guild = await guilds.indexGuild(msg.guild.id)
        const currentBanChannel = guild.messageProtector.logChannel

        if (currentBanChannel != mpChannelId) {
            await guild.updateOne({ 'messageProtector.logChannel': mpChannelId })
            return msg.reply(`**Canal de mensagens excluídas alterado para <#${mpChannelId}>**`)
        }
        else return msg.reply(`**O canal <#${mpChannelId}> já está definido como meu mensagens excluídas!!**`)
    }
}