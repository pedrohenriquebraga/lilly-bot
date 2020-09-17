const Discord = require('discord.js')

module.exports = {
    name: 'avatar',
    description: 'Mostra o avatar do usuário',
    args: false,
    guildOnly: false,
    aliases: ['showavatar', 'fotoperfil', 'avt', 'perfil'],
    usage: '$avatar',
    execute(msg, args) {
        const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor('#ff0092')
            .setTitle(`Avatar de ${msg.author.username}`)
            .addField(
                `👤 Veja seu avatar!!`, 
                `⬇ Para baixar o avatar **[aqui](${msg.author.avatarURL()})**`
            )
            .setImage(msg.author.avatarURL({ dynamic: true }))
        msg.reply('', serverInfoEmbed)
    }
}
