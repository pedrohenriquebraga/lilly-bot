const Discord = require('discord.js')
const bot = new Discord.Client()

module.exports = {
    name: 'userinfo',
    description: 'Mostra informações do usuário que enviou o comando, podendo também mencionar o usuário que ele deseja saber as informações.', 
    args: false,
    guildOnly: false,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    usage: '$userinfo (?usuário)',
    aliases: ['infousuario', 'usuario', 'user'],
    async execute(msg, args) {

        let idMember = undefined
        let user = undefined

        if (args[0]) {
            idMember = args.shift()
                .split('')
                .filter(num => (Number(num) || num == 0)).join('')
        }

        if (!idMember) user = msg.mentions.users.first() || msg.author
        else user = await bot.users.fetch(idMember)

        const date = new Date()
        const actuallyYear = parseInt(date.getFullYear())
        const userCreatedAt = user.createdAt.toString()

        if (args[0]) userJoinedAt = msg.mentions.members.first().joinedAt || await bot.users.fetch(idMember).joinedAt || msg.author

        const userCreatedDates = userCreatedAt.split(' ')
        const userCreatedAccount = actuallyYear - parseInt(userCreatedDates[3])

        const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor('#ff0092')
            .setTitle(`📝 Informações do Usuário`)
            .setDescription('Aqui estão algumas informações deste usuário')
            .setThumbnail(user.avatarURL())
            .addFields(
                {name: '▶ Nome de Usuário', value: `${user.username}`},
                {name: '🆔 ID do Usuário', value: `${user.id}`},
                {name: '🏷️ Tag do Usuário', value: `${user.discriminator}`},
                {name: '📅 Criado há', value: `${userCreatedAccount} ano(s) atrás às ${userCreatedDates[4]}`}
            )
        msg.reply('', serverInfoEmbed)
    }
}