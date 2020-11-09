const members = require("../../controllers/membersController");

module.exports = {
    name: 'lillyban',
    description: 'Usado para banir usuários de usar a Lilly',
    args: true,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Ser dono da Lilly ou Administrador dela',
    lillyPermissions: 'Nenhuma',
    aliases: ['lb', 'banirdalilly'],
    usage: '$lillyban (usuário)',
    async execute(msg, args, bot) {
        if (msg.author.id !== '374303268068655107')
            return msg.reply('**Ei, só meu o meu criador pode usar este comando!!**')
        
        let user
        try { user = await bot.users.fetch(args.shift()) } 
        catch { user = msg.mentions.users.first() }
        const reason = args.join(' ') || 'Motivo não informado'

        if (!user)
            return msg.reply('**Não consegui achar este usuário!!**')

        if (user.id == '374303268068655107')
            return msg.reply('**Você não pode banir meu o meu criador!!**')
        try { 
            await members.updateDataMembers({ memberId: user.id }, { lillyBan: true })
            user.send('Você foi banido **permanentemente** da Lilly!! Você não poderá usar meus comandos em todos os servidores que ativaram a *LCT*! Você poderá contestar nossa decisão no servidor de suporte: https://discord.gg/SceHNfZ .\n\n'  + '**Motivo do banimento: **`' + reason + '`')

            return msg.channel.send(`**${msg.author}, o usuário *${user.username}* foi permanentemente banido da Lilly!!**\n`)
        } catch(err) {
            console.error('Erro ao banir usuário: \n', err);
        }
    }
}