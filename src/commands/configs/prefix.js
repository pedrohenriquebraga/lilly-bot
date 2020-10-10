const mongoose = require('mongoose')
const guildsController = require('../../controllers/guildsController')

module.exports = {
    name: 'setprefix',
    description: 'Muda o prefixo usado no servidor',
    args: true,
    guildOnly: true,
    userPermissions: 'Gerenciar Servidor ou Administrador',
    lillyPermissions: 'Nenhuma',
    aliases: ['prefix', 'prefixo'],
    usage: '$setprefix (prefixo)',
    async execute(msg, args) {
        if (args[0].length > 1 || args[0].length < 10) {
            const memberHasPermission = msg.member.hasPermission("ADMINISTRATOR") || msg.member.hasPermission('MANAGE_GUILD')

            if (memberHasPermission) {
                await guildsController.updatePrefix( msg.guild.id, args[0] )
                .then(() => {
                    return msg.reply('**Prefixo atualizado com sucesso para ``' + args[0] + '``!!**')
                }).catch(() => {
                    return msg.reply('**Ocorreu um erro quando fui mudar seu prefixo!!**')
                })
                
            } else {
                return msg.reply('**Você não tem permissão para atualizar o prefixo do server!!**')
            }
        } else {
            return msg.reply('O prefixo deve ter de 1 a 10 de tamanho!!')
        }
    }
}
