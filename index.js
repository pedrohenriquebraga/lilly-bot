require("dotenv").config();

const fs = require("fs");
const cors = require("cors");
const express = require("express");
const routes = require("./src/routes");
const app = express();
const compression = require("compression");
const zlib = require("zlib");
const mongoose = require("mongoose");

const config = require("./config.json");
const lilly = require("./lilly.json");
const { secondsToMs } = require("./utils/utilsCommands");

const Discord = require("discord.js");
const bot = new Discord.Client();

const votosZuraaa = require("./src/votosZuraaa");
// const DBL = require("dblapi.js");
// const dbl = new DBL(
//   process.env.DBL_TOKEN, {
//   webhookPort: 5000,
//   webhookAuth: process.env.DBL_AUTH_TOKEN,
// }, bot);

const guilds = require("./src/controllers/guildsController");
const members = require("./src/controllers/membersController");
const mongoConnection = process.env.MONGO_URLCONNECTION; // Obtém a URI de conexão com o Banco de Dados
const token = process.env.DISCORD_TOKEN; // Obtém o Token de conexão do Discord
let ready = false;

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
process.on("unhandledRejection", (error) => console.error(error));

const commandFolders = fs.readdirSync("./src/commands");
let commandList = [];

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

// A cada 60 segundos, o bot atualiza o Discord Status
setInterval(async () => {
  if (ready) {
    serversAmount = bot.guilds.cache.size;
    let status = [
      `Eu já estou em ${serversAmount} servidores!!`,
      `</> Já foram executados ${lilly.dailyCommands} comandos desde o último reinício!!`,
      `🌐 Acesse "${config.websiteURL}/commands" e veja meus comandos!`,
      `Me mencione e veja meu prefixo neste servidor!!`,
      `🔗 Entre no servidor de suporte: "https://discord.gg/SceHNfZ"`,
    ];

    await bot.user.setStatus("online");
    await bot.user.setActivity(
      status[Math.floor(Math.random() * status.length)]
    );
  }
}, secondsToMs(60));

// dbl.on("error", (e) => console.error("Ocorreu um erro no DBL: \n", e));
// dbl.webhook.on('ready', hook => {
//   console.log(`Webhook rodando em http://${hook.hostname}:${hook.port}${hook.path}`);
// });
// dbl.webhook.on("vote", async (vote) => {
//   await bot.users.fetch(vote.user).then(async (user) => {
//     await user.send(lilly.defaultReply.voteReply);

//     const id = String(user.id);
//     const member = await members.indexMember(id);
//     const money = parseInt(member.money) + 1000;
//     await members.updateDataMembers({ memberId: id }, { money: money });
//   })
// });

// Quando o bot está pronto
bot.once("ready", async () => {
  ready = true;
  serversAmount = await bot.guilds.cache.size;
  bot.user.setStatus("online");
  bot.user.setActivity(lilly.defaultReply.firstStatus);
  setInterval(() => dbl.postStats(serversAmount), secondsToMs(1800))
});

bot.on("message", async (msg) => {
  let vote = false;
  // Sistema de recompensas por votos
  await votosZuraaa.verificaVotos(msg, async (user) => {
    vote = true;
    await user.send(lilly.defaultReply.voteReply);

    const id = String(user.id);
    const member = await members.indexMember(id);
    const money = parseInt(member.money) + 1000;
    await members.updateDataMembers({ memberId: id }, { money: money });
  });

  // Caso a mensagem seja na verdade um voto retorna a função
  if (vote) return;
  if (msg.channel.type == "dm") return 

  // Procura o servidor no banco de dados e o usuário que digitou o comando
  let guild = await guilds.indexGuild(msg.guild.id);
  if (!guild) guild = await guilds.createNewGuild(msg.guild.id)

  let member = await members.indexMember(msg.author.id);
  if (!member) member = await members.saveMember(msg.author.id)

  const prefix = guild.guildPrefix || "$";
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
    msg.reply(lilly.defaultReply.lillyBanReply);
    return msg.deletable ? msg.delete() : false;
  }

  // Verifica se o comando existe
  if (!command) {
    msg.reply("O comando `" + `${prefix}` + commandName + "` não existe!!");

    return msg.deletable ? msg.delete() : false;
  }

  // Verifica se comando precisa de argumentos e se esses argumentos foram passados
  if (command.args && !args.length) {
    let reply = `Você deve passar argumentos para está função ${msg.author}!!`;
    if (command.usage) reply += "\n`` " + command.usage + " ``";

    msg.channel.send(reply);
    return msg.deletable ? msg.delete() : false;
  }

  // Verifica se o comandos é de economia e se o servidor permite o uso desse tipo de comando
  if (!guild.economy && command.economy) {
    msg.reply("Este servidor não permite comandos de economia!!");
    return msg.deletable ? msg.delete() : false;
  }

  const commandChannelPermission =
    msg.member.hasPermission("MANAGE_GUILD") ||
    msg.member.hasPermission("ADMINISTRATOR");

  // Verifica se o canal é o canal de comando da Lilly
  if (commandChannel) {
    if (commandChannel !== msg.channel.id && !commandChannelPermission) {
      msg.reply(
        `**Você só pode digitar comandos no canal <#${guild.commandChannel}>!!**`
      );
      return msg.deletable ? msg.delete() : false;
    }
  }

  // Tenta executar o comando, caso de erro, retorna o erro no chat
  try {
    lilly.dailyCommands++;
    command.execute(msg, args, bot);
  } catch (error) {
    console.error(error);
    msg.reply(lilly.defaultReply.errorCommandReply + error + "`");
  }

  // Deleta a mensagem caso seja possível
  if (msg.deletable) msg.delete();
});

bot.on("guildMemberAdd", async (member) => {
  // Cadastra novos usuários assim que entrarem em servidores com a Lilly
  await members.saveMember(member.id);
});

// API Lilly
app.get("/api/commandList", (req, res) => {
  return res.json(commandList);
});

app.listen(process.env.PORT || 3333);
