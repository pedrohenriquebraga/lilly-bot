const members = require("../../controllers/membersController");
const emojis = require("../../../emojis.json")

module.exports = {
    name: 'htop',
    description: 'Mostra o ranking de pessoas mais ricas de Halitas da Lilly',
    args: false,
    guildOnly: true,
    economy: true,
    premium: false,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    aliases: ['halitatop', 'halitarank'],
    usage: '$htop',
    async execute(msg, args, bot) {
        const halitaTop = await members.getHalitasTop()
        let count = 1
        let halitaTopEmbed = {
            color: '#ff0092',
            title: '💰 Halitas Top',
            description: 'Aqui estão as 10 pessoas que mais tem Halitas',
            fields: []
        }
        
        for (const memberTop of halitaTop) {
            const memberName = await bot.users.fetch(memberTop.memberId).then(user => user.username)
            halitaTopEmbed.fields.push({
                name: `${count}° ` + '`' + memberName + '`',
                value: `${emojis.halita} | **${memberTop.specialMoney} Halitas**`,
            })
            count += 1
        }
        return msg.reply('', {embed: halitaTopEmbed})
    }
}