const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config({path: __dirname + "/.env"})

const token = process.env.DISCORD_TOKEN


client.on('message', msg => {
    if (msg.content == '$lilly') {
        msg.channel.send('Olá, eu sou a Lilly!!')
    }
})

client.login(token)
