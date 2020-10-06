module.exports = {
    name: 'clear',
    description: 'Comando usado para apagar até 100 mensagens de canais',
    args: true,
    guildOnly: true,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    aliases: ['limpar'],
    usage: '$clear (número)',
    execute(msg, args) {
        const deleteMessageNumber = parseInt(args[0])
        const authorizeUser = msg.member.hasPermission('MANAGE_MESSAGES') || msg.member.hasPermission('ADMINISTRATOR')

        if (!deleteMessageNumber) return msg.reply('Você deve informar um número válido!!')

        if (deleteMessageNumber < 2 || deleteMessageNumber > 100) {
            return msg.reply('Você deve informar um número entre 2 e 100!!')
        }

        if (!authorizeUser) return msg.reply('Você não tem permissão de usar este comando!!')

        msg.channel.bulkDelete(deleteMessageNumber, true).then(() => {
            msg.reply('**O chat foi limpo com sucesso!!**')
        }).catch((err) => {
            msg.reply('**Erro ao tentar apagar as mensagens!! Lembrando que eu não consigo apagar mensagens que foram enviadas a mais de 2 semanas por limitações do Discord!!**')
            console.error(err)
        }) 
        
        return false
    }
}