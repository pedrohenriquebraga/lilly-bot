require('dotenv').config()
const fs = require('fs')
const cors = require('cors')
const express = require('express')
const app = express()


const mongoose = require('mongoose')
let commandList = []

const Discord = require('discord.js')
const guildsController = require('./controllers/guildsController')
const membersController = require('./controllers/membersController')
const bot = new Discord.Client()

// Obtém token de conexão do Discord
const mongoPassword = process.env.MONGO_PASSWORD
const token = process.env.DISCORD_TOKEN

app.use(cors())
app.use(express.static('public'))
app.disable('x-powered-by')

mongoose.connect(`mongodb+srv://GameSantos:${mongoPassword}@lilly0.pxy52.gcp.mongodb.net/discord?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
})

// Acessa a API do Discord com Token obtido
bot.login(token)
bot.commands = new Discord.Collection()

process.on('unhandledRejection', error => console.error(error))

const commandFolders = fs.readdirSync('./src/commands')

//  Pega todos os comandos da Lilly de todas as pastas da pasta commands
for (const folder of commandFolders) {
    const files = fs.readdirSync(`./src/commands/${folder}`)
        .filter(file => file.endsWith('.js'))

    for (const file of files) {
        const command = require(`./commands/${folder}/${file}`)
        commandList.push(command)
        bot.commands.set(command.name, command)
    }
}

// Atualiza a quantidade de servers que a Lilly está
let serversAmount = bot.guilds.cache.size

async function newGuildAndMembers() {
    const guilds = bot.guilds.cache.array()
    for (guild of guilds) {
        const existGuild = await guildsController.indexGuild(guild.id)
        if (!existGuild) await guildsController.createNewGuild(guild.id)

        for (members of guild.members.cache) {
            for ( const member of members) {

                if (member.user) {
                    const existMember = await membersController.indexMember(member.user.id)
                    if (!existMember) {
                        console.log('Vou salvar')
                        try {
                            console.log(member.user.id)
                            await membersController.saveMember(member.user.id)
                        } catch (error) {
                            console.error('Não foi possível cadastrar o usuário!!', error)
                        }
                    }

                }
            }
        }
    }
}

function secondsToMs(second) { return second * 1000 }


setInterval(() => {
    serversAmount = bot.guilds.cache.size

    bot.user.setStatus('online')
    bot.user.setActivity(`Use o prefixo "$" para me deixar feliz!! Já estou em ${serversAmount} servidores!!`)

    newGuildAndMembers()
}, secondsToMs(60))

bot.once('ready', async () => {
    serversAmount = await bot.guilds.cache.size

    bot.user.setStatus('online')
    bot.user.setActivity(`Use o prefixo "$" para me deixar feliz!! Já estou em ${serversAmount} servidores!!`)

    newGuildAndMembers()

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


// WebSite da Lilly

app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/views/index.html')
})

app.get('/commands', (req, res) => {
    return res.sendFile(__dirname + '/views/commands.html')
})

app.get('/api/commandList', (req, res) => {
    return res.json(commandList)
})

app.listen(process.env.PORT || 3000)
