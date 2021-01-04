const lilly = require("../lilly.json");
const emojis = require("../emojis.json");
const { secondsToMs } = require("../utils/utilsCommands");

async function verifyVote(msg, members) {
  const votosZuraaa = require("../src/votosZuraaa");
  let vote = false;
  await votosZuraaa.verificaVotos(msg, async (user) => {
    await user.send(lilly.defaultReply.voteReply);

    const id = String(user.id);
    const member = await members.indexMember(id);
    if (!member) member = await members.saveMember(id);

    const money = parseInt(member.money) + 1200;
    await members.updateDataMembers({ memberId: id }, { money: money });

    return (vote = true);
  });

  return vote;
}

async function messageProtector(msg, guild, bot) {
  if (
    !guild.messageProtector ||
    !guild.messageProtector.isActive ||
    msg.author.id == bot.user.id
  )
    return { recuse: false, reason: "" };

  const config = {
    content: msg.content,
    discordInviteRegex: /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/,
    urlRegex: new RegExp(
      /((?:http(s)?:\/\/)?(?:www(\d)?\.)?([\w\-]+\.[a-z]\w{2,})\/?((?:\?(?:[\w\-]+(?:=[\w\-]+)?)?(?:&[\w\-]+(?:=[\w\-]+)?)?))?(#(?:[^\s]+)?)?)/gi
    ),
    antiLink: guild.messageProtector.antiLink,
    antiInvite: guild.messageProtector.antiInvite,
    antiMassUser: guild.messageProtector.antiMassUserMention,
    antiMassChannel: guild.messageProtector.antiMassChannelMention,
    antiMassRole: guild.messageProtector.antiMassRoleMention,
    amountUserMentions: guild.messageProtector.maxUsersMentions || 5,
    amountRoleMentions: guild.messageProtector.maxRolesMentions || 5,
    amountChannelMentions: guild.messageProtector.maxChannelsMentions || 5,
    linksChannels: guild.messageProtector.allowedLinksChannelsId || [],
    invitesChannels: guild.messageProtector.allowedInvitesChannelsId || [],
    linksUsers: guild.messageProtector.allowedLinksUsersId || [],
    inviteUsers: guild.messageProtector.allowedInviteUsersId || [],
    msgFilterUsers: guild.messageProtector.allowedMsgFiltersUser || [],
  };

  // Anti Link
  if (
    config.antiLink &&
    !config.discordInviteRegex.test(config.content) &&
    config.urlRegex.test(config.content) &&
    config.linksUsers.indexOf(msg.author.id) == -1 &&
    config.linksChannels.indexOf(msg.channel.id) == -1
  ) {
    return { recuse: true, reason: "Links não são permitidos" };
  }

  // Anti Convite
  else if (
    config.antiInvite &&
    config.discordInviteRegex.test(config.content) &&
    config.inviteUsers.indexOf(msg.author.id) == -1 &&
    config.invitesChannels.indexOf(msg.guild.id) == -1
  ) {
    return { recuse: true, reason: "Convites não são permitidos" };
  } else if (
    config.msgFilterUsers.indexOf(msg.author.id) == -1 &&
    config.antiMassUser &&
    msg.mentions.users.size > config.amountUserMentions
  ) {
    return {
      recuse: true,
      reason: `Mensagem com mais menções de usuários que o permitido`,
    };
  } else if (
    config.msgFilterUsers.indexOf(msg.author.id) == -1 &&
    config.antiMassRole &&
    msg.mentions.roles.size > config.amountRoleMentions
  ) {
    return {
      recuse: true,
      reason: `Mensagem com mais menções de cargos que o permitido`,
    };
  } else if (
    config.msgFilterUsers.indexOf(msg.author.id) == -1 &&
    config.antiMassChannel &&
    msg.mentions.channels.size > config.amountChannelMentions
  ) {
    return {
      recuse: true,
      reason: `Mensagem com mais menções de canais que o permitido`,
    };
  }

  return { recuse: false, reason: "" };
}

function verifyMentionBot(msg, bot) {
  if (
    msg.content.trim() == `<@${bot.user.id}>` ||
    msg.content.trim() == `<@!${bot.user.id}>`
  ) {
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
  if (verifyMentionBot(msg, bot)) {
    if (msg.deletable) msg.delete();
    return msg
      .reply(
        `Meu prefixo neste servidor é \`${prefix}\`, se quiser saber a lista completa de comandos basta digitar \`${prefix}help\`!!`
      )
      .then((msg) => msg.delete({ timeout: secondsToMs(20) }));
  }

  // Verifica se é um comando a mensagem

  const protector = await messageProtector(msg, guild, bot);

  if (protector.recuse) {
    const recuseEmbed = {
      title: `${emojis.unckeck} Mensagem excluída`,
      description: `**${emojis.members} Autor:** ${msg.author}\n**${emojis.outage} Motivo:** \`${protector.reason}\`\n**#️⃣ Canal:** ${msg.channel}\n**📨 Mensagem:** \`${msg.content}\``,
    };

    let mpChannel = {};

    try {
      mpChannel = await bot.channels.fetch(guild.messageProtector.logChannel);
    } catch {
      mpChannel = msg.channel;
    }
    mpChannel.send({ embed: recuseEmbed });
    return msg.delete();
  }

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
