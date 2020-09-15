require('dotenv').config()
const fs = require('fs')
const express = require('express')
const app = express()
const Discord = require('discord.js')
const bot = new Discord.Client()
const token = process.env.DISCORD_TOKEN

bot.login(token)
bot.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
for (file of commandFiles) {
    const command = require(`./commands/${file}`)

    bot.commands.set(command.name, command)
}


bot.once('ready', () => {
    bot.user.setStatus('online')
    bot.user.setActivity('Use o prefixo "$" para me deixar feliz!!')
})

bot.on('message', msg => {
    
    if ( !msg.content.startsWith('$') || msg.author.bot ) return false

    const args = msg.content.slice('$'.length).trim().split(/ +/)
    const command = args.shift().toLowerCase()
    console.log(command)

    if( !bot.commands.has(command) ) return false

    try {
        bot.commands.get(command).execute(msg, args)
    } catch (error) {
        console.error(error)
        msg.reply('Algo de errado aconteceu ao tentar executar o comando! ``' + error + '``' )
    }

    if (command == '$say') {
        bot.commands.get('say').execute(msg, args)
    }

    if (command == '$lilly') {
        msg.reply(`Eu sou a Lilly!! Fui criada pelo <@374303268068655107>!`)
    }


    msg.delete()
})

app.listen(process.env.PORT || 3000)
