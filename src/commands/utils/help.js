const Discord = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Mostra como o usuário pode ser ajudado',
    args: false,
    guildOnly: false,
    aliases: ['ajuda', 'ajude'],
    usage: '``$help``',
    execute(msg, args) {
        const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor('#ff0092')
            .setTitle('Olá, eu sou a Lilly!')
            .setDescription('Vejo que você está precisando de minha ajuda, e eu estou aqui para isso. Abaixo você verá algumas opções que podem ajudar e alguns links úteis.')
            .setThumbnail('https://cdn.discordapp.com/avatars/754548334328283137/d98abaf5aec0265914b604b47eef9583.png')
            .addFields(
                { name: '📨 Me convide para seu server', value: `[Ficarei muito feliz em fazer parte de seu servidor!](https://discord.com/api/oauth2/authorize?client_id=754548334328283137&permissions=8&scope=bot)` },
                { name: '👷‍♂️ Entre em contato com o suporte', value: `[Minha equipe de suporte vai ficar feliz em receber suas dúvidas em meu servidor!](https://discord.gg/SceHNfZ)` },
                { name: '🗳 Vote na Lilly', value: `[Vote em mim para que eu consiga mais amiguinhos!!](https://zuraaa.com/bots/754548334328283137)` },
                { name: '🌐 Acesse meu Website', value: '*(em breve)*' },
                { name: '<> Meus comandos', value: `*(em breve)*` }
            )
            .setFooter('Com muito amor ❤ | Lilly')
        msg.reply('', serverInfoEmbed)
    }
}