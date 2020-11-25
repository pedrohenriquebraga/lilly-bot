const guildsController = require("../../controllers/guildsController");
const setCommandChannel = require("../configs/commandchannel");
const banChannel = require("../configs/banchannel");
const  welcomeChannel = require("../configs/welcomechannel");

module.exports = {
  name: "setchannel",
  description: "Configura canais para o uso da lilly",
  args: true,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Gerenciar o servidor",
  lillyPermissions: "Nenhuma",
  aliases: ["definecanal", "definircanal", "setnnel"],
  usage: "$setchannel(tipo [ban, com, eco, wc, ...]) (?canal)",
  execute(msg, args) {
    const economyAliases = ["eco", "economy", "economia"];
    const banAliases = ["ban", "banimento"];
    const commandsAliases = ["com", "commands", "comandos"];
    const welcomeAliases = ["welcome", 'wc', 'bem-vindo']

    const hasPermission =
      msg.member.hasPermission("ADMINISTRATOR") ||
      msg.member.hasPermission("MANAGER_GUILD");

    if (!hasPermission)
      return msg.reply("Você não tem permissão de usar este comando!!");

    if (commandsAliases.indexOf(args[0]) > -1) {
      return setCommandChannel.execute(msg, args);
    } 
    else if (banAliases.indexOf(args[0]) > -1 ) {
      return banChannel.execute(msg, args)
    }
    else if (welcomeAliases.indexOf(args[0]) > -1) {
      return welcomeChannel.execute(msg, args)
    }

    return msg.reply(`O tipo \`${args[0]}\` não é reconhecido!!`);
  },
};
