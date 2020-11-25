const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'commandchannel',
    description: 'Define um canal onde será digitado todos os comandos da Lilly.',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Gerenciar o servidor',
    lillyPermissions: 'Nenhuma',
    aliases: ['setcommandchannel', 'comchannel', 'canalcomando'],
    usage: '$commandchannel (?canal)',
    async execute(msg, args) {
        const userPermission = msg.member.hasPermission("MANAGER_GUILD") || msg.member.hasPermission("ADMINISTRATOR")
        let commandChannelId

        try { commandChannelId = msg.mentions.channels.array().shift().id }
        catch { commandChannelId = msg.channel.id }

        if (!userPermission) return msg.reply('**Você não tem permissão de alterar o canal de meus comandos!!**')

        if (!commandChannelId) return msg.reply('**Informe um canal válido para definir como meu canal de comandos!!**')

        const guild = await guilds.indexGuild(msg.guild.id)
        const currentCommandChannel = guild.commandChannel

        if (currentCommandChannel != commandChannelId) {
            await guilds.updateDataGuild({ guildId: msg.guild.id }, { commandChannel: commandChannelId })
            return msg.reply(`**Canal de comandos alterado para <#${commandChannelId}>**`)
        }
        else return msg.reply(`**O canal <#${commandChannelId}> já está definido como meu canal de comandos!!**`)
    }
}