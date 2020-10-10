require('dotenv').config()
const fs = require('fs')
const cors = require('cors')
const express = require('express')
const app = express()
const compression = require('compression')
const zlib = require('zlib')


const mongoose = require('mongoose')
let commandList = []

const Discord = require('discord.js')
const guildsController = require('./controllers/guildsController')
const membersController = require('./controllers/membersController')
const bot = new Discord.Client()

// Obtém token de conexão do Discord
const mongoPassword = process.env.MONGO_PASSWORD
const token = process.env.DISCORD_TOKEN

// Configura o cors para só o endereço da Lilly tenha acesso as informações das páginas
app.use(cors({
    origin: 'https://lilly-discordbot.herokuapp.com/',
    optionsSuccessStatus: 200
}))

// Informa a pasta pública
app.use(express.static('public'))
app.disable('x-powered-by')

// Realiza a compressão dos arquivos enviados
app.use(compression({ level: 9 }))

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
            for (const member of members) {

                if (member.user) {
                    const existMember = await membersController.indexMember(member.user.id)
                    if (!existMember) {
                        try {
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

// A cada 60 segundos, o bot atualiza o Discord Status e cadastra novos servidores não cadastrados

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

    // Procura o servidor no banco de dados

    let guild = await guildsController.indexGuild(msg.guild.id)

    // Se o servidor não for encontrado, ele realiza o cadastro automaticamente

    if (!guild) guild = guildsController.createNewGuild(msg.guild.id)

    const prefix = guild.prefix || '$'
    const economy = guild.economy 
    const commandChannel = guild.commandChannel == msg.guild.id.toString()
    const commandChannelPermission = msg.member.hasPermission("MANAGE_GUILD") || msg.member.hasPermission('ADMINISTRATOR')

    if (!msg.content.startsWith(prefix) || msg.author.bot) return false

    const args = msg.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    // Verifica se o comando existe

    if (!command) {
        return msg.reply('O comando `' + `${prefix}` + commandName + '` não existe!!')
    }

    // Verifica se comando precisa de argumentos e se esses argumentos foram passados 

    if (command.args && !args.length) {

        let reply = `Você deve passar argumentos para está função ${msg.author}!!`
        if (command.usage) reply += `\n${command.usage}`

        return msg.channel.send(reply)
    }

    // Verifica se o comandos é de economia e se o servidor permite o uso desse tipo de comando
    
    if (!economy && command.economy) return msg.reply('Este servidor não permite comandos de economia!!')

    // Verifica se o comando foi usado em DM e se ele pode ser usado em DM

    if (command.guildOnly && msg.channel.type == 'dm') {
        return msg.reply('Este comando só pode ser usado em servidores!!')
    }

    // Verifica se o canal é o canal de comando da Lilly
    if (commandChannel) {
       if ( (!commandChannel) && (!commandChannelPermission) ) { 
           return msg.reply(`**Você só pode digitar comandos no canal <#${guild.commandChannel}>!!**`)
       }
   }

    // Tenta executar o comando, caso de erro, retorna o erro no chat

    try {
        command.execute(msg, args)
    } catch (error) {
        console.error(error)
        msg.reply('**Algo muito errado aconteceu ao tentar executar o comando!** \n``' + error + '``')
    }

    msg.delete()
})



bot.on('guildMemberAdd', async (member) => {
    // Cadastra novos usuários assim que entrarem em servidores com a Lilly

    await membersController.saveMember(member.id)
})


// WebSite da Lilly (Temporário)

// Rota principal
app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/views/index.html')
})

// Rota para mostrar comandos
app.get('/commands', (req, res) => {
    return res.sendFile(__dirname + '/views/commands.html')
})

// Rota API que retorna lista de comandos
app.get('/api/commandList', (req, res) => {
    return res.json(commandList)
})

app.listen(process.env.PORT || 3000)
