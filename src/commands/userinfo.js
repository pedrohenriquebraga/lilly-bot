const Discord = require('discord.js')

module.exports = {
    name: 'userinfo',
    description: 'Mostra informações do usuário que enviou o comando, podendo também mencionar o usuário que ele deseja saber as informações.', 
    args: false,
    guildOnly: false,
    usage: '``$userinfo <?usuário>``',
    aliases: ['infousuario', 'usuario', 'user'],
    execute(msg, args) {
        const user = msg.mentions.users.first() || msg.author
        const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor('#ff0092')
            .setTitle(`📝 Informações do Usuário`)
            .setDescription('Aqui estão algumas informações deste usuário')
            .setThumbnail(user.avatarURL())
            .addFields(
                {name: '▶ Nome de Usuário', value: `${user.username}`},
                {name: '🆔 ID do Usuário', value: `${user.id}`},
                {name: '🏷️ Tag do Usuário', value: `${user.discriminator}`}
            )
        msg.reply('', serverInfoEmbed)
    }
}