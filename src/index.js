require('dotenv').config()
const fs = require('fs')
const express = require('express')
const app = express()

const mongoose = require('mongoose')

const Discord = require('discord.js')
const guildsController = require('./controllers/guildsController')
const membersController = require('./controllers/membersController')
const bot = new Discord.Client()

// Obtém token de conexão do Discord
const mongoPassword = process.env.MONGO_PASSWORD
const token = process.env.DISCORD_TOKEN

mongoose.connect(`mongodb+srv://GameSantos:${mongoPassword}@lilly0.pxy52.gcp.mongodb.net/discord?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

// Acessa a API do Discord com Token obtido
bot.login(token)
bot.commands = new Discord.Collection()

process.on('unhandledRejection', error => console.error(error))

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

//  Page todos os comandos da Lilly na pasta commands
for (file of commandFiles) {
    const command = require(`./commands/${file}`)

    bot.commands.set(command.name, command)
}

// Atualiza a quantidade de servers que a Lilly está
let serversAmount = bot.guilds.cache.size
const secondsToMs = 1000

async function newGuildAndMembers() {
    const guilds = bot.guilds.cache.array()
    for (guild of guilds) {
        const existGuild = await guildsController.indexGuild(guild.id)
        if (!existGuild) await guildsController.createNewGuild(guild.id)

        for (members of guild.members.cache) {
            for (member of members) {
                if (member.user) {
                    const existMember = await membersController.indexMember(member.user.id)
                    if (!existMember) await membersController.saveMember(member.user.id)
                }
            }
        }
    }
}


    setInterval(() => {
        serversAmount = bot.guilds.cache.size

        bot.user.setStatus('online')
        bot.user.setActivity(`Use o prefixo "$" para me deixar feliz!! Já estou em ${serversAmount} servidores!!`)

        newGuildAndMembers()
    }, 60 * secondsToMs)

    bot.once('ready', () => {
        serversAmount = bot.guilds.cache.size

        bot.user.setStatus('online')
        bot.user.setActivity(`Use o prefixo "$" para me deixar feliz!! Já estou em ${serversAmount} servidores!!`)
    })


    bot.on('message', async msg => {

        const prefix = await guildsController.indexGuildPrefix(msg.guild.id) || '$'

        if (!msg.content.startsWith(prefix) || msg.author.bot) return false

        const args = msg.content.slice(prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()

        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

        if (!command) {
            return msg.reply('O comando `' + `${prefix}` + commandName + '` não existe!!')
        }

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

    bot.on('guildMemberAdd', async (member) => {
        await membersController.saveMember(member.id)
    })

    app.get('/', (req, res) => {
        res.send('OK')
    })

    app.listen(process.env.PORT || 3000)
