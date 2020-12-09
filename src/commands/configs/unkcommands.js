const guilds = require("../../controllers/guildsController");

module.exports = {
  name: "unkcommands",
  description:
    "Escolha se quer ou não que a Lilly informe se comandos não existem",
  args: false,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Gerenciar o servidor ou Administrador",
  lillyPermissions: "Nenhuma",
  aliases: ["unkcom", "descomandos"],
  usage: "$unkcommands",
  async execute(msg, args) {
    const userPermission =
      msg.member.hasPermission("MANAGE_GUILD") ||
      msg.member.hasPermission("ADMINISTRATOR");

    if (!userPermission)
      return msg.reply(
        "Você não pode determinar se eu vou ou não avisar comandos desconhecidos"
      );
    let guild = await guilds.indexGuild(msg.guild.id);

    if (guild.commandsConfig.warnUnkCommand == undefined)
      guild.commandsConfig.warnUnkCommand = false;

    switch (guild.commandsConfig.warnUnkCommand) {
      case true:
        await guilds.updateDataGuild(
          { guildId: msg.guild.id },
          { "commandsConfig.warnUnkCommand": false }
        );
        return msg.reply("Foi desabilitado os avisos de comandos desconhecidos!!");
      case false:
        await guilds.updateDataGuild(
          { guildId: msg.guild.id },
          { "commandsConfig.warnUnkCommand": true }
        );
        return msg.reply("Foi habilitado os avisos de comandos desconhecidos!!");
      default:
        return msg.reply(
          "Não foi possível fazer a alteração nos avisos de comandos desconhecidos!!"
        );
    }
  },
};
