const Discord = require('discord.js')

module.exports = {
    name: 'serverinfo',
    description: 'Mostra informações do server',
    execute(msg, args) {
        const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor('#ff0092')
            .setTitle('📝 Informações do Server')
            .setDescription('Aqui estão algumas informações deste servidor')
            .setThumbnail(msg.guild.iconURL())
            .addFields(
                {name: '🏷️ Nome do Servidor', value: `${msg.guild.name}`},
                {name: '👥 Total de Membros', value: `${msg.guild.memberCount} membros`},
                {name: '🌎 Região', value: `${msg.guild.region}`}
            )
        msg.reply(serverInfoEmbed)
    }
}
