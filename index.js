require("dotenv").config();
process.on("unhandledRejection", (error) => console.error(error));

const fs = require("fs");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./config.json");
const lilly = require("./lilly.json");
const { startLilly } = require("./lilly/startLilly");
const { statusUpdate, workMachines, lottery } = require("./utils/intervals");
const placeholdersBuilder = require("./utils/placeholderMessageBuilder")
const verifyMessage = require("./lilly/verifymessage")
const Discord = require("discord.js");
const bot = new Discord.Client();

const guilds = require("./src/controllers/guildsController");
const members = require("./src/controllers/membersController");
const commandFolders = fs.readdirSync("./src/commands");
let commandList = [];

// Inicia tudo que é necessário para o funcionamento da Lilly
startLilly(app, express, config, mongoose, bot, members)

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

// Quando o bot está pronto
bot.once("ready", async () => {
  serversAmount = await bot.guilds.cache.size;
  bot.user.setStatus("online");
  bot.user.setActivity(lilly.defaultReply.firstStatus);
  statusUpdate(bot);
  workMachines(bot, members)
  lottery(bot)
});

bot.on("message", async (msg) => {
  /* Esta função é responsável por gerenciar todas ás mensagens enviadas.
  Aqui ele verifica se é um comando válido, enviado por uma pessoa
  válida, em uma guild válida, etc.*/

  return verifyMessage(msg, guilds, members, bot)
});

bot.on("guildMemberAdd", async (member) => {
  // Cadastra novos usuários assim que entrarem em servidores com a Lilly
  const existMember = await members.indexMember(member.id);
  if (!existMember) await members.saveMember(member.id);

  const guild = await guilds.indexGuild(member.guild.id)
  const welcomeConfig = guild.welcomeConfig
  const autoroles = guild.autoroles
  const rolePermission = member.guild.me.hasPermission("MANAGE_ROLES") || 
  member.guild.me.hasPermission("ADMINISTRATOR")

  if (welcomeConfig) {
     if (welcomeConfig.isActive && welcomeConfig.channel) {
       const welcomeChannel = await bot.channels.fetch(welcomeConfig.channel)
       const welcomeMsg = placeholdersBuilder(welcomeConfig.message, member)

       welcomeChannel.send(welcomeMsg)
     }
   }

  if (autoroles && rolePermission) {
    autoroles.map(roleId => {
      const role = member.guild.roles.cache.get(roleId)
      if (role) return member.roles.add(role)
    })
  }
});

// API Lilly
app.get("/api/commandList", (req, res) => {
  return res.json(commandList);
});
app.listen(process.env.PORT || 3333, () =>
  console.log("[ App sendo ouvido na porta 3333 ]")
);
