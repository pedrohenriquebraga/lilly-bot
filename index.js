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
const Discord = require("discord.js");
const bot = new Discord.Client();
const votosZuraaa = require("./src/votosZuraaa");

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
  let vote = false;
  // Sistema de recompensas por votos
  await votosZuraaa.verificaVotos(msg, async (user) => {
    vote = true;
    await user.send(lilly.defaultReply.voteReply);

    const id = String(user.id);
    const member = await members.indexMember(id);
    if (!member) member = await members.saveMember(id)

    const money = parseInt(member.money) + 1000;
    await members.updateDataMembers({ memberId: id }, { money: money });
  });

  // Caso a mensagem seja na verdade um voto retorna a função
  if (vote) return;
  if (msg.channel.type == "dm") return;

  // Procura o servidor no banco de dados e o usuário que digitou o comando
  let guild = await guilds.indexGuild(msg.guild.id);
  if (!guild) guild = await guilds.createNewGuild(msg.guild.id);

  let member = await members.indexMember(msg.author.id);
  if (!member) member = await members.saveMember(msg.author.id)

  const prefix = guild.guildPrefix || "$";
  const commandChannel = guild.commandChannel || "";

  // Verifica se a Lilly foi mencionada e retorna o prefixo do servidor
  if (msg.content.trim() == "<@754548334328283137>") {
    if (msg.deletable) msg.delete();
    return msg.reply(`Meu prefixo neste servidor é \`${prefix}\`, se quiser saber a lista completa de comandos basta digitar \`${prefix}help\`!!`)
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
    msg.reply(`O comando \`${prefix}\`\`${commandName}\` não existe!!`);

    return msg.deletable ? msg.delete() : false;
  }

  // Verifica se comando precisa de argumentos e se esses argumentos foram passados
  if (command.args && !args.length) {
    const lillyPedia = require("./utils/lillyPedia");
    msg.reply("", { embed: lillyPedia(command, msg) });
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
