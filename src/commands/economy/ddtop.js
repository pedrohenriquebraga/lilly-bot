const members = require("../../controllers/membersController");
const Discord = require("discord.js");
const bot = new Discord.Client();

module.exports = {
    name: 'ddtop',
    description: 'Mostra o ranking de pessoas mais ricas de DinDins da Lilly',
    args: false,
    guildOnly: true,
    economy: true,
    premium: false,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    aliases: ['dindintop', 'dindinrank'],
    usage: '$ddtop',
    async execute(msg, args) {
        const moneyTop = await members.getDinDinsTop()
        let count = 1
        let moneyTopEmbed = {
            color: '#ff0092',
            title: '💰 DinDins Top',
            description: 'Aqui estão as 10 pessoas mais ricas que eu conheço',
            fields: []
        }
        
        for (const memberTop of moneyTop) {
            const memberName = await bot.users.fetch(memberTop.memberId).then(user => user.username)
            moneyTopEmbed.fields.push({
                name: `${count}° ` + '`' + memberName + '`',
                value: `💵 | **${memberTop.money} DinDins**`,
            })
            count += 1
        }
        return msg.reply('', {embed: moneyTopEmbed})
    }
}