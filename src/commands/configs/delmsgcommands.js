const guilds = require("../../controllers/guildsController");

module.exports = {
  name: "delmsgcommands",
  description:
    "Escolha se a Lilly deve apagar às mensagens de comandos",
  args: false,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Gerenciar o servidor ou Administrador",
  lillyPermissions: "Nenhuma",
  aliases: ["delcom", "apagacom"],
  usage: "$delmsgcommands",
  async execute(msg, args) {
    const userPermission =
      msg.member.hasPermission("MANAGE_GUILD") ||
      msg.member.hasPermission("ADMINISTRATOR");

    if (!userPermission)
      return msg.reply(
        "Você não pode determinar se a eu vou apagar mensagens de comandos"
      );
    let guild = await guilds.indexGuild(msg.guild.id);

    if (guild.commandsConfig.delMsgCommand == undefined)
      guild.commandsConfig.delMsgCommand = false;

    switch (guild.commandsConfig.delMsgCommand) {
      case true:
        await guilds.updateDataGuild(
          { guildId: msg.guild.id },
          { "commandsConfig.delMsgCommand": false }
        );
        return msg.reply("Todas às mensagens de comandos de comandos serão mantidas no chat");
      case false:
        await guilds.updateDataGuild(
          { guildId: msg.guild.id },
          { "commandsConfig.delMsgCommand": true }
        );
        return msg.reply("Todas às mensagens de comandos de comandos serão apagadas no chat");
      default:
        return msg.reply(
          "Não foi possível fazer a alteração nas mensagens de comandos!!"
        );
    }
  },
};
