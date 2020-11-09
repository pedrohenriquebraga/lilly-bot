const guilds = require('../../controllers/guildsController')

module.exports = {
    name: 'lct',
    description: 'Habilita ou desabilita a "Lista de Contatinhos Teimosos" da Lilly (proíbe usuários banidos da Lilly de usar comandos)',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Gerenciar o servidor ou Administrador',
    lillyPermissions: 'Nenhuma',
    aliases: ['listacontantosteimosos'],
    usage: '$lct',
    async execute(msg, args) {
        const userPermission = msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission("ADMINISTRATOR")

        if (!userPermission) return msg.reply('Você não pode habilitar/desabilitar a LCT!!')
        const guildLctPermission = await guilds.indexGuild(msg.guild.id)

        switch (guildLctPermission.globalMembersBan) {
            case true:
                await guilds.updateDataGuild({ guildId: msg.guild.id }, { globalMembersBan: false })
                return msg.reply('Foi desabilitado a LCT neste servidor!! **Usuários banidos na Lilly poderão usar meus comandos!!**')
            case false:
                await guilds.updateDataGuild({ guildId: msg.guild.id }, { globalMembersBan: true })
                return msg.reply('Foi habilitado a LCT neste servidor!! **Usuários banidos na Lilly não poderão usar meus comandos!!**')
            default:
                return msg.reply('Não foi possível fazer a alteração na LCT!!')
        }
    }
}