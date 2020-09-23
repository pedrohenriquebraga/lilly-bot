const Discord = require('discord.js')

module.exports = {
    name: 'userinfo',
    description: 'Mostra informações do usuário que enviou o comando, podendo também mencionar o usuário que ele deseja saber as informações.', 
    args: false,
    guildOnly: false,
    usage: '``$userinfo <?usuário>``',
    aliases: ['infousuario', 'usuario', 'user'],
    async execute(msg, args) {
        const user = msg.mentions.users.first() || msg.author

        console.log()
        const date = new Date()
        const actuallyYear = parseInt(date.getFullYear())

        const userCreatedAt = user.createdAt.toString()
    
        let userJoinedAt = msg.member.joinedAt

        if (args[0]) {
            userJoinedAt = msg.mentions.members.first().joinedAt
        }

        const userCreatedDates = userCreatedAt.split(' ')
        const userJoinedDates = userJoinedAt.toString().split(' ')

        console.log(userCreatedDates)
        console.log(userJoinedDates)

        const userCreatedAccount = actuallyYear - parseInt(userCreatedDates[3])
        const userJoinedServer = actuallyYear - parseInt(userJoinedDates[3])
        

        const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor('#ff0092')
            .setTitle(`📝 Informações do Usuário`)
            .setDescription('Aqui estão algumas informações deste usuário')
            .setThumbnail(user.avatarURL())
            .addFields(
                {name: '▶ Nome de Usuário', value: `${user.username}`},
                {name: '🆔 ID do Usuário', value: `${user.id}`},
                {name: '🏷️ Tag do Usuário', value: `${user.discriminator}`},
                {name: '📅 Criado há', value: `${userCreatedAccount} ano(s) atrás às ${userCreatedDates[4]}`},
                {name: '📨 Entrou há', value: `${userJoinedServer} ano(s) atrás às ${userJoinedDates[4]}`},
            )
        msg.reply('', serverInfoEmbed)
    }
}