const Discord = require('discord.js')
const bot = new Discord.Client()

module.exports = {
    name: 'avatar',
    description: 'Mostra o avatar do usuário',
    args: false,
    guildOnly: false,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    aliases: ['showavatar', 'fotoperfil', 'avt', 'perfil'],
    usage: '$avatar (?usuário)',
    async execute(msg, args) {
        const idMember = args.shift()
            .split('')
            .filter(num => (Number(num) || num == 0)).join('')

        const user = msg.mentions.users.first() || await bot.users.fetch(idMember) || msg.author

        const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor('#ff0092')
            .setTitle(`Avatar de ${user.username}`)
            .addField(
                `👤 Veja seu avatar!!`, 
                `⬇ Baixe o avatar **[aqui!](${user.avatarURL()})**`
            )
            .setImage(user.avatarURL({ format: 'png' ,dynamic: true }))
        msg.reply('', serverInfoEmbed)
    }
}
