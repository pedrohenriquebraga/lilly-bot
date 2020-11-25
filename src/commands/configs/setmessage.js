const guilds = require("../../controllers/guildsController");

module.exports = {
  name: "setmessage",
  description:
    "Defina mensagens para comandos personalizáveis (placeholders são aceitos em algumas mensagens)!",
  args: true,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Gerenciar o Servidor",
  lillyPermissions: "Nenhuma",
  aliases: ["setmsg", "definemensagem"],
  usage: "$setmessage (tipo da mensagem [wc]) (mensagem)",
  async execute(msg, args) {
    const actions = ["wc", "welcome", "bem-vindo"];
    const placeholders = [
      " *`{@user}`* | **Menciona usuários**\n",
      "*`{username}`* | **Mostra o nome do usuário**\n",
      "*`{avatar}`* | **Mostra a url do avatar do usuário** \n",
      "*`{guildName}`* | **Mostra o nome do servidor**",
    ];
    const memberPermissions =
      msg.member.hasPermission("MANAGE_GUILD") ||
      msg.member.hasPermission("ADMINISTRATOR");

    const action = args.shift().trim().toLowerCase();
    const message = args.join(" ");
    const guild = await guilds.indexGuild(msg.guild.id);

    if (!memberPermissions) return msg.reply("**Você não tem permissão**");
    if (actions.indexOf(action) === -1)
      return msg.reply(
        `**Escolha o tipo da mensagem que você quer mudar, veja os tipos disponíveis: \`${actions.join(
          ", "
        )}\`**`
      );
    if (!message)
      return msg.reply(
        `**Informe uma mensagem para ser alterada, você pode usar os seguintes placeholders:** \n\n${placeholders.join(
          " "
        )}`
      );

    if (action == "wc") {
      await guild.updateOne({ "welcomeConfig.message": message });
      return msg.reply("**A mensagem foi atualizada com sucesso!**");
    }
  },
};
