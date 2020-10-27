const guildsController = require("../../controllers/guildsController");
const setCommandChannel = require("../configs/commandchannel");

module.exports = {
  name: "setchannel",
  description: "Configura canais para o uso da lilly",
  args: true,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Gerenciar o servidor ou Administrador",
  lillyPermissions: "Nenhuma",
  aliases: ["definecanal", "definircanal", "setnnel"],
  usage: "$setchannel <tipo [ban, com, eco, ...]> <?canal>",
  execute(msg, args) {
    const economyAliases = ["eco", "economy", "economia"];
    const banAliases = ["ban", "banimento"];
    const commandsAliases = ["com", "commands", "comandos"];

    const hasPermission =
      msg.author.hasPermission("ADMINISTRATOR") ||
      msg.author.hasPermission("MANAGER_GUILD");

    if (!hasPermission)
      return msg.reply("Você não tem permissão de usar este comando!!");

    if (commandsAliases.indexOf(args[0]) > -1) {
      return setCommandChannel.execute(msg, args);
    }

    return msg.reply(
      "O tipo " + "``" + args[0] + "``" + " não é reconhecido!!"
    );
  },
};
