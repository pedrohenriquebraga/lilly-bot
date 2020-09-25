require('dotenv').config()
const fs = require('fs')
const express = require('express')
const app = express()
const Discord = require('discord.js')
const bot = new Discord.Client()
const token = process.env.DISCORD_TOKEN

bot.login(token)
bot.commands = new Discord.Collection()

process.on('unhandledRejection', error => console.error(error))

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
for (file of commandFiles) {
    const command = require(`./commands/${file}`)

    bot.commands.set(command.name, command)
}


setInterval(() => {
    const serversAmount = bot.guilds.cache.size
    bot.user.setStatus('online')
    bot.user.setActivity(`Use o prefixo "$" para me deixar feliz!! Já estou em ${serversAmount} servidores!!`)
}, 20000)

bot.once('ready', () => {
    const serversAmount = bot.guilds.cache.size
    bot.user.setStatus('online')
    bot.user.setActivity(`Use o prefixo "$" para me deixar feliz!! Já estou em ${serversAmount} servidores!!`)
})


bot.on('message', msg => {

    if (!msg.content.startsWith('$') || msg.author.bot) return false

    const args = msg.content.slice('$'.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return msg.reply('O comando `$' + commandName + '` não existe!!')

    if (command.args && !args.length) {

        let reply = `Você deve passar argumentos para está função ${msg.author}!!`
        if (command.usage) reply += `\n${command.usage}`

        return msg.channel.send(reply)
    }

    if (command.guildOnly && msg.channel.type == 'dm') {
        return msg.reply('Este comando só pode ser usado em servidores!!')
    }


    try {
        command.execute(msg, args)
    } catch (error) {
        console.error(error)
        msg.reply('Algo de errado aconteceu ao tentar executar o comando! \n``' + error + '``')
    }
    msg.delete()
})

app.get('/', (req, res) => {
    res.send('OK')
})

app.listen(process.env.PORT || 3000)
