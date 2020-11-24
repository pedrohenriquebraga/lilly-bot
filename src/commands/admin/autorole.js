const guilds = require("../../controllers/guildsController");

module.exports = {
  name: "autorole",
  description: "Dê cargos assim que membros entrarem no servidor",
  args: true,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Gerenciar o Servidor",
  lillyPermissions: "Gerenciar Cargos",
  aliases: ["autocargo", "arole"],
  usage: "$autorole (add ou remover) (cargos)",
  async execute(msg, args) {
    const addRoleAliases = ["add", "adicionar"];
    const removeRoleAliases = ["remove", "remover"];
    const memberPermissions = msg.member.hasPermission("MANAGE_GUILD") || 
    msg.member.hasPermission("ADMINISTRATOR")
    let action;

    if(!memberPermissions) 
      return msg.reply("**Você não pode alterar os cargos automáticos**")
    if (addRoleAliases.indexOf(args[0]) != -1) action = "add";
    else if (removeRoleAliases.indexOf(args[0]) != -1) action = "remove";
    if (!action) return msg.reply("**Informe uma ação a ser realizada!**");
    if (msg.mentions.roles.array().length <= 0)
      return msg.reply("**Mencione cargos para concluir a ação!**");

    const guild = await guilds.indexGuild(msg.guild.id);
    const allAutoRoles = guild.autoroles;
    const selectedRoles = msg.mentions.roles.array();

    for (role of selectedRoles) {
      if (action == "add") {
        if (allAutoRoles.indexOf(role.id) == -1) allAutoRoles.push(role.id);
      } else if (action == "remove") {
        if (allAutoRoles.indexOf(role.id) != -1) allAutoRoles.splice(allAutoRoles.indexOf(role.id), 1);
      }
    }

    await guild.updateOne({ autoroles: allAutoRoles });

    return msg.reply("**Cargos automáticos atualizados!**");
  },
};
