const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'msgprotector',
    description: 'Ativa ou desativa todas às proteções de mensagens do servidor.',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    fun: false,
    userPermissions: 'Gerenciar o servidor',
    lillyPermissions: 'Nenhuma',
    aliases: ['msgtor'],
    usage: '$msgprotector',
    async execute(msg, args) {
        const userPermission = msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")

        if (!userPermission) return msg.reply('Você não pode ativar ou desativar às proteções de mensagens')
        let guild = await guilds.indexGuild(msg.guild.id)

        if (guild.messageProtector.isActive == undefined) 
            guild.messageProtector.isActive = false

        switch (guild.messageProtector.isActive) {
            case true:
                await guild.updateOne({ 'messageProtector.isActive': false })
                return msg.reply('Foi desativada às proteções de mensagens!!')
            case false:
                await guild.updateOne({ 'messageProtector.isActive': true })
                return msg.reply('Foi ativada às proteções de mensagens!!')
            default:
                return msg.reply('Não foi possível fazer a alteração nas proteções de mensagens!!')
        }
    }
}