const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()


client.on('message', msg => {
    if (msg.content == '$lilly') {
        msg.channel.send('Olá, eu sou a Lilly!!')
    }
})


client.login(`${process.env.DISCORD_TOKEN}`)
