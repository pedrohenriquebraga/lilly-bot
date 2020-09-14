const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()

const token = process.env.DISCORD_TOKEN.toString()


client.on('message', msg => {
    if (msg.content == '$lilly') {
        msg.channel.send('Olá, eu sou a Lilly!!')
    }
})

client.login(token)
