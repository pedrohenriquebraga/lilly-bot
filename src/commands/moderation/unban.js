const discord = require('discord.js')
const bot = new discord.Client()

module.exports = {
    name: 'unban',
    description: 'Tira o banimento de usuários',
    args: true,
    guildOnly: true,
    aliases: ['desbanir'],
    usage: '``$unban <membro> <?motivo>``',
    async execute(msg, args) {
        const firstArg = args.shift().split('')
            .filter(num => (Number(num) || num == 0)).join('')
        const unbanMember = msg.mentions.members.first() || await bot.users.fetch(firstArg)

        const author = msg.member
        const authorPermission = author.hasPermission("BAN_MEMBERS") || author.hasPermission("ADMINISTRATOR")

        const reason = args.join(" ") || '<< Motivo Desconhecido >>'

        if (!unbanMember) {
            return msg.reply('Mencione um usuário ou informe seu ID válido para ser desbanido!')
        }

        if (!authorPermission) {
            return msg.reply('Você não tem permissão de desbanir usuários! **Lembre-se que eu preciso ter permissão de banir usuários ou de administrador!!**')
        }

        try {
            msg.guild.members.unban(unbanMember, { reason: reason })

            return msg.channel.send(`✔ | **O usuário ${unbanMember} foi desbanido por ${msg.author}**\n` + '**📨 | Motivo:** `' + reason + '`')
        } catch (error) {
           return msg.reply('Ocorreu um erro ao tentar desbanir este usuário!')
        }
    
    }
}
