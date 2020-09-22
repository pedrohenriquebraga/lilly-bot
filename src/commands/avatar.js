const Discord = require('discord.js')

module.exports = {
    name: 'avatar',
    description: 'Mostra o avatar do usuário',
    args: false,
    guildOnly: false,
    aliases: ['showavatar', 'fotoperfil', 'avt', 'perfil'],
    usage: '$avatar <? usuário>',
    execute(msg, args) {
        const user = msg.mentions.users.first() || msg.author
        const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor('#ff0092')
            .setTitle(`Avatar de ${user.username}`)
            .addField(
                `👤 Veja seu avatar!!`, 
                `⬇ Baixe o avatar **[aqui!](${user.avatarURL()})**`
            )
            .setImage(user.avatarURL({ format: '.png' ,dynamic: true }))
        msg.reply('', serverInfoEmbed)
    }
}
