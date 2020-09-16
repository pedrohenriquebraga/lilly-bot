module.exports = {
    name: 'lilly',
    description: 'A Lilly se apresenta para quem enviou a mensagem!!',
    guildOnly: false,
    args: false,
    aliases: ['whoisyou', 'quemevoce'],
    execute(msg, args) {
        msg.channel.send(`Olá ${msg.author}, eu sou a Lilly!! Fui criada pelo <@374303268068655107>!`)
    }
}