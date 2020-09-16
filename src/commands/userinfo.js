const Discord = require('discord.js')

module.exports = {
    name: 'userinfo',
    description: 'Mostra informações do usuário',
    execute(msg, args) {
        const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor('#ff0092')
            .setTitle(`📝 Informações do Usuário`)
            .setDescription('Aqui estão algumas informações deste usuário')
            .setThumbnail(msg.author.avatarURL())
            .addFields(
                {name: '▶ Nome de Usuário', value: `${msg.author.username}`},
                {name: '🆔 ID do Usuário', value: `${msg.author.id}`},
                {name: '🏷️ Tag do Usuário', value: `${msg.author.discriminator}`}
            )
        msg.reply('', serverInfoEmbed)
    }
}