module.exports = {
  name: "unlock",
  description: "Destrava canais que você trancou",
  args: false,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Administrador ou Gerenciar o Servidor",
  lillyPermissions: "Gerenciar Canais",
  aliases: ["destravar"],
  usage: "$unlock (?canal)",
  async execute(msg, args, bot) {
    let channel;
    const userPermission =
      msg.member.hasPermission("ADMINISTRATOR") ||
      msg.member.hasPermission("MANAGE_GUILD");

    try {
      channel = await bot.channels.fetch(args[0]);
    } catch {
      channel = msg.mentions.channels.first() || msg.channel;
    }

    if (!userPermission)
      return msg.reply("**Você não tem permissão de destravar canais!**");

    channel
      .updateOverwrite(msg.guild.roles.everyone, { SEND_MESSAGES: true })
      .then(() =>
        msg.reply(
          "**🔓 | Este canal foi destrancado, agora todos podem enviar mensagens novamente!! Caso queira trancar este canal de novo basta digitar `$lock`**"
        )
      )
      .catch((err) => console.error("Erro ao destravar o canal: \n", err));
  },
};
