module.exports = {
    name: 'serverinfo',
    description: 'Mostra informações do server',
    execute(msg, args) {
        msg.channel.send(`**Nome do servidor:** ${msg.guild.name}\n**Total de membros:** ${msg.guild.memberCount} membros`)
    }
}