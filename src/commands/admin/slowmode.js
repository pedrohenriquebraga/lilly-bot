module.exports = {
  name: "slowmode",
  description: "Defina o tempo de envio de mensagens em um canal.",
  args: false,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Gerenciar Canais ou Administrador",
  lillyPermissions: "Gerenciar Canais",
  aliases: ["modolento"],
  usage: "$slowmode (?segundos (0 para tirar))",
  async execute(msg, args, bot) {
    const permission =
      msg.member.hasPermission("MANAGE_GUILD") ||
      msg.member.hasPermission("ADMINISTRATOR");
    const botPermission = msg.guild.me.hasPermission("MANAGE_CHANNELS");
    const time = parseInt(args.shift()) || 0;

    if (!permission)
      return msg.reply(
        "**Você não tem permissão de definir o tempo de envio de  mensagens!**"
      );

    if (!botPermission)
      return msg.reply(
        "**Desculpe, mas eu preciso ter permissão de `Gerenciar Canais`!**"
      );

    if (time == 0) {
      await msg.channel.setRateLimitPerUser(time);
      return msg.reply("**O modo lento foi desativado!!**");
    }

    
    await msg.channel.setRateLimitPerUser(time);
    return msg.reply(
      `**O modo lento foi ativo, o intervalo é de ${time} segundos**!!` + ' Digite `$slowmode 0` para desativar!'
    );
  },
};
