const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'antiinvite',
    description: 'Ativa ou desativa o antiinvite da Lilly.',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    fun: false,
    userPermissions: 'Gerenciar o servidor',
    lillyPermissions: 'Nenhuma',
    aliases: ['antiinv', 'anticonvite'],
    usage: '$antilink',
    async execute(msg, args) {
        const userPermission = msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")

        if (!userPermission) return msg.reply('Você não pode ativar ou desativar o antiinvite')
        let guild = await guilds.indexGuild(msg.guild.id)

        if (guild.messageProtector.antiInvite == undefined) 
            guild.messageProtector.antiInvite = false

        switch (guild.messageProtector.antiInvite) {
            case true:
                await guild.updateOne({ 'messageProtector.antiInvite': false })
                return msg.reply('Foi desativado o antiinvite da Lilly!!')
            case false:
                await guild.updateOne({ 'messageProtector.antiInvite': true })
                return msg.reply('Foi ativado o antiinvite da Lilly!!')
            default:
                return msg.reply('Não foi possível fazer a alteração no antiinvite da Lilly!!')
        }
    }
}