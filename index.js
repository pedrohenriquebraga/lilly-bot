require("dotenv").config();
const fs = require("fs");
const cors = require("cors");
const express = require("express");
const routes = require("./src/routes");
const app = express();
const compression = require("compression");
const zlib = require("zlib");
const config = require('./config.json')
const emojis = require('./utils/lillyEmojis')[0]

const votosZuraaa = require("./src/votosZuraaa");

const mongoose = require("mongoose");
let ready = false;


const Discord = require("discord.js");
const guildsController = require("./src/controllers/guildsController");
const membersController = require("./src/controllers/membersController");
const bot = new Discord.Client();

// Obtém token de conexão do Discord
const mongoConnection = process.env.MONGO_URLCONNECTION;
const token = process.env.DISCORD_TOKEN;

// Configura toda a API
app.use(express.json());
app.use(
  cors({
    origin: "https://lilly-website.herokuapp.com",
    optionsSuccessStatus: 200,
  })
);
app.use(routes);
app.disable("x-powered-by");
app.use(compression({ level: 9 }));

mongoose.connect(mongoConnection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Acessa a API do Discord com Token obtido
bot.login(token);
bot.commands = new Discord.Collection();
let commandList = [];

process.on("unhandledRejection", (error) => console.error(error));

const commandFolders = fs.readdirSync("./src/commands");

//  Pega todos os comandos da Lilly de todas as pastas da pasta commands

for (const folder of commandFolders) {
  const files = fs
    .readdirSync(`./src/commands/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const command = require(`./src/commands/${folder}/${file}`);
    if (folder != "owner") commandList.push(command);
    bot.commands.set(command.name, command);
  }
}

// Atualiza a quantidade de servers que a Lilly está
let serversAmount = bot.guilds.cache.size;
let totalCommandsDay = 0

// Registra novos membros e servidores
async function newGuildAndMembers() {
  const guilds = bot.guilds.cache.array();
  for (guild of guilds) {
    const existGuild = await guildsController.indexGuild(guild.id);
    if (!existGuild) await guildsController.createNewGuild(guild.id);

    for (members of guild.members.cache) {
      for (const member of members) {
        try {
          member.user.id;
        } catch {
          return;
        }

        const existMember = await membersController.indexMember(member.user.id);
        if (!existMember) {
          try {
            await membersController.saveMember(member.user.id);
          } catch (error) {
            console.error("Não foi possível cadastrar o usuário!!", error);
          }
        }
      }
    }
  }
}

// Transforma segundos em ms.
function secondsToMs(second) { return second * 1000 }

// A cada 24 horas reseta o total de comandos usados
setInterval(() => totalCommandsDay = 0, secondsToMs(86400))

// A cada 60 segundos, o bot atualiza o Discord Status e cadastra novos servidores não cadastrados
setInterval(async () => {
  if (ready) {
    serversAmount = bot.guilds.cache.size;

    let status = [
      `Eu já estou em ${serversAmount} servidores!!`,
      `</> Já foram executados ${totalCommandsDay} comandos desde o último reinício!!`,
      `🌐 Acesse "${config.websiteURL}/commands" e veja meus comandos!`,
      `Me mencione e veja meu prefixo neste servidor!!`,
      `🔗 Entre no servidor de suporte: "https://discord.gg/SceHNfZ"`
    ]

    await bot.user.setStatus("online");
    await bot.user.setActivity(
      status[Math.floor(Math.random() * status.length)]
    );
  }

  newGuildAndMembers();
}, secondsToMs(60));

// Quando o bot está pronto
bot.once("ready", async () => {
  ready = true;
  serversAmount = await bot.guilds.cache.size;

  bot.user.setStatus("online");
  bot.user.setActivity(
    "Olá, eu sou a Lilly!!"
  );

  newGuildAndMembers();
});

bot.on("message", async (msg) => {
  let vote = false;

  // Sistema de recompensas por votos
  await votosZuraaa.verificaVotos(msg, async (user) => {
    vote = true;
    await user.send(
      "💜 **Obrigado por votar em mim**!! Saiba que ao votar em mim você me ajuda conhecer novos amiguinhos!! Ahh... já ia me esquecendo, tome **1000 DinDins** para gastar como quiser!"
    );

    const id = String(user.id);
    const member = await (await membersController.indexMember(id));
    const money = parseInt(member.money) + 1000;

    if (money >= 0) {
      await membersController.updateDataMembers(
        { memberId: id },
        { money: money }
      );
    }
  });

  // Caso a mensagem seja na verdade um voto retorna a função
  if (vote) return;

  // Procura o servidor no banco de dados e o usuário que digitou o comando
  let guild = await guildsController.indexGuild(msg.guild.id);
  let member = await membersController.indexMember(msg.author.id)

  // Se o servidor não for encontrado, ele realiza o cadastro automaticamente
  if (!guild) guild = guildsController.createNewGuild(msg.guild.id);

  const prefix = guild.guildPrefix || "$";

  const economy = guild.economy;
  const commandChannel = guild.commandChannel || "";

  // Verifica se a Lilly foi mencionada e retorna o prefixo do servidor
  if (msg.content.trim() == "<@754548334328283137>") {
    if (msg.deletable) msg.delete();
    return msg.reply(
      "Meu prefixo neste servidor é `" +
        prefix +
        "`, se quiser saber a lista completa de comandos basta digitar `" +
        `${prefix}help` +
        "`!!"
    );
  }

  // Verifica se é um comando a mensagem
  if (!msg.content.startsWith(prefix) || msg.author.bot) return false;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    bot.commands.get(commandName) ||
    bot.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (member.lillyBan && guild.globalMembersBan) {
    msg.reply('**Você está permanentemente banido de usar todos os meus comandos!!**')
    return msg.deletable ? msg.delete() : false
  }

  // Verifica se o comando existe
  if (!command) {
    msg.reply(
      "O comando `" + `${prefix}` + commandName + "` não existe!!"
    );

    return msg.deletable ? msg.delete() : false
  }

  // Verifica se comando precisa de argumentos e se esses argumentos foram passados

  if (command.args && !args.length) {
    let reply = `Você deve passar argumentos para está função ${msg.author}!!`;
    if (command.usage) reply += "\n`` " + command.usage + " ``";

    msg.channel.send(reply);
    return msg.deletable ? msg.delete() : false
  }

  // Verifica se o comandos é de economia e se o servidor permite o uso desse tipo de comando

  if (!economy && command.economy) {
    msg.reply("Este servidor não permite comandos de economia!!")
    return msg.deletable ? msg.delete() : false
  }

  // Verifica se o comando foi usado em DM e se ele pode ser usado em DM

  if (command.guildOnly && msg.channel.type == "dm") {
    return msg.reply("Este comando só pode ser usado em servidores!!");
  }

  const commandChannelPermission =
    msg.member.hasPermission("MANAGE_GUILD") ||
    msg.member.hasPermission("ADMINISTRATOR");

  // Verifica se o canal é o canal de comando da Lilly
  if (commandChannel) {
    if (
      commandChannel !== msg.channel.id.toString() &&
      !commandChannelPermission
    ) {
      msg.reply(
        `**Você só pode digitar comandos no canal <#${guild.commandChannel}>!!**`
      );
      return msg.deletable ? msg.delete() : false
    }
  }

  // Tenta executar o comando, caso de erro, retorna o erro no chat

  try {
    totalCommandsDay++
    command.execute(msg, args, bot);
  } catch (error) {
    console.error(error);
    msg.reply(
      "**Algo muito errado aconteceu ao tentar executar o comando!** \n``" +
        error +
        "``"
    );
  }

  if (msg.deletable) msg.delete();
});

bot.on("guildMemberAdd", async (member) => {
  // Cadastra novos usuários assim que entrarem em servidores com a Lilly

  const existMember = await membersController.indexMember(member.id);
  if (!existMember) await membersController.saveMember(member.id);
});

// API Lilly
app.get("/api/commandList", (req, res) => {
  return res.json(commandList);
});

app.listen(process.env.PORT || 3333)
