module.exports = {
  name: "lock",
  description: "Trava um canal para que ninguém consiga falar",
  args: false,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Administrador ou Gerenciar o Servidor",
  lillyPermissions: "Gerenciar Canais",
  aliases: ["travar"],
  usage: "$lock (?canal)",
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
      return msg.reply("**Você não tem permissão de travar canais!**");

    channel
      .updateOverwrite(msg.guild.roles.everyone, { SEND_MESSAGES: false })
      .then(() =>
        msg.reply(
          "**🔒 | Este canal foi trancado, agora ninguém pode enviar mensagens!! Caso queira destrancar este canal basta digitar `$unlock`**"
        )
      )
      .catch((err) => console.error("Erro ao travar o canal: \n", err));
  },
};
