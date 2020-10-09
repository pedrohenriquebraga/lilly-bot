const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'changecolor',
    description: 'Habilita ou desabilita a possibilidade de mudar a cor do nome do usuário',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Gerenciar o servidor ou Administrador',
    lillyPermissions: 'Nenhuma',
    aliases: ['ccolor', 'mudacor'],
    usage: '$changecolor',
    async execute(msg, args) {
        const userPermission = msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")

        if (!userPermission) return msg.reply('Você não pode habilitar/desabilitar o comando de mudar cores!!')
        const guildChangeColorPermission = await guilds.indexGuild(msg.guild.id)

        switch (guildChangeColorPermission.changeColor) {
            case true:
                guilds.updateDataGuild({ guildId: msg.guild.id }, { changeColor: false })
                return msg.reply('Foi desabilitado todos os comandos de troca de cor!!')
            case false:
                guilds.updateDataGuild({ guildId: msg.guild.id }, { changeColor: true })
                return msg.reply('Foi habilitado todos os comandos de troca de cor!!')
            default:
                return msg.reply('Não foi possível fazer a alteração nos comandos de cores!!')
        }
    }
}