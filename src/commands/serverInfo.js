const Discord = require('discord.js')

module.exports = {
    name: 'serverinfo',
    description: 'Mostra informações do server',
    guildOnly: false,
    args: false,
    aliases: ['infoservidor', 'servidor', 'server'],
    execute(msg, args) {
        const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor('#ff0092')
            .setTitle('📝 Informações do Server')
            .setDescription('Aqui estão algumas informações deste servidor')
            .setThumbnail(msg.guild.iconURL())
            .addFields(
                {name: '🏷️ Nome do Servidor', value: `${msg.guild.name}`},
                {name: '👥 Total de Membros', value: `${msg.guild.memberCount} membros`},
                {name: '👑 Dono do Servidor', value: ```${msg.guild.owner}``(${msg.guild.ownerId})`},
                {name: '🌎 Região', value: `${msg.guild.region.toUpperCase()}`}
            )
        msg.reply('', serverInfoEmbed)
    }
}
