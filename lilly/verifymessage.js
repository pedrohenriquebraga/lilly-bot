const lilly = require("../lilly.json");
const { secondsToMs } = require("../utils/utilsCommands");

async function verifyVote(msg, members) {
  const votosZuraaa = require("../src/votosZuraaa");
  let vote = false;
  await votosZuraaa.verificaVotos(msg, async (user) => {
    await user.send(lilly.defaultReply.voteReply);

    const id = String(user.id);
    const member = await members.indexMember(id);
    if (!member) member = await members.saveMember(id);

    const money = parseInt(member.money) + 1000;
    await members.updateDataMembers({ memberId: id }, { money: money });

    return (vote = true);
  });

  return vote;
}

function verifyMentionBot(msg) {
  if (msg.content.trim() == "<@754548334328283137>") {
    return true;
  } else {
    return false;
  }
}

function verifyLillyBan(member) {
  if (member.lillyBan && guild.globalMembersBan) {
    return true;
  } else return false;
}

function verifyArgs(command, args) {
  if (command.args && !args.length) return true;
  else return false;
}

function verifyCommandChannels(msg, commandChannel, commandChannelPermission) {
  if (commandChannel !== msg.channel.id && !commandChannelPermission) {
    return true;
  } else {
    return false;
  }
}

// Área principal

async function verifyMessage(msg, guilds, members, bot) {
  let vote = await verifyVote(msg, members);

  // Caso a mensagem seja na verdade um voto retorna a função
  if (vote) return;
  if (msg.channel.type == "dm") return;

  // Procura o servidor no banco de dados e o usuário que digitou o comando
  let guild = await guilds.indexGuild(msg.guild.id);
  if (!guild) guild = await guilds.createNewGuild(msg.guild.id);

  let member = await members.indexMember(msg.author.id);
  if (!member) member = await members.saveMember(msg.author.id);

  const prefix = guild.guildPrefix || "$";
  const commandChannel = guild.commandChannel || "";

  // Verifica se a Lilly foi mencionada e retorna o prefixo do servidor
  if (verifyMentionBot(msg)) {
    if (msg.deletable) msg.delete();
    return msg
      .reply(
        `Meu prefixo neste servidor é \`${prefix}\`, se quiser saber a lista completa de comandos basta digitar \`${prefix}help\`!!`
      )
      .then((msg) => msg.delete({ timeout: secondsToMs(20) }));
  }

  // Verifica se é um comando a mensagem
  if (!msg.content.startsWith(prefix) || msg.author.bot) return false;
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().normalize().toLowerCase();
  const command =
    bot.commands.get(commandName) ||
    bot.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (verifyLillyBan(member)) {
    msg
      .reply(lilly.defaultReply.lillyBanReply)
      .then((msg) => msg.delete({ timeout: secondsToMs(15) }));
    return msg.deletable ? msg.delete() : false;
  }

  // Verifica se o comando existe
  if (!command) {
    if (guild.commandsConfig.warnUnkCommand)
      msg
        .reply(`O comando \`${prefix}\`\`${commandName}\` não existe!!`)
        .then((msg) => msg.delete({ timeout: secondsToMs(5) }));
    return msg.deletable ? msg.delete() : false;
  }

  // Verifica se comando precisa de argumentos e se esses argumentos foram passados
  if (verifyArgs(command, args)) {
    const lillyPedia = require("../utils/lillyPedia");
    msg
      .reply("", { embed: lillyPedia(command, msg) })
      .then((msg) => msg.delete({ timeout: secondsToMs(30) }));
    return msg.deletable ? msg.delete() : false;
  }

  // Verifica se o comandos é de economia e se o servidor permite o uso desse tipo de comando
  if (!guild.economy && command.economy) {
    msg
      .reply("Este servidor não permite comandos de economia!!")
      .then((msg) => msg.delete({ timeout: secondsToMs(5) }));
    return msg.deletable ? msg.delete() : false;
  }

  const commandChannelPermission =
    msg.member.hasPermission("MANAGE_GUILD") ||
    msg.member.hasPermission("ADMINISTRATOR");

  // Verifica se o canal é o canal de comando da Lilly
  if (commandChannel) {
    if (verifyCommandChannels(msg, commandChannel, commandChannelPermission)) {
      msg
        .reply(
          `**Você só pode digitar comandos no canal <#${guild.commandChannel}>!!**`
        )
        .then((msg) => msg.delete({ timeout: secondsToMs(5) }));
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
  if (msg.deletable && guild.commandsConfig.delMsgCommand) msg.delete();
}

module.exports = verifyMessage;
