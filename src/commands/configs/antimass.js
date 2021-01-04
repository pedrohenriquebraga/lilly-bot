const guilds = require("../../controllers/guildsController");

module.exports = {
  name: "antimass",
  description:
    "Ativa ou desativa configurações de envio de informações em massa como menções, canais, etc em mensagens",
  args: false,
  guildOnly: true,
  economy: false,
  premium: false,
  fun: false,
  userPermissions: "Gerenciar o servidor",
  lillyPermissions: "Nenhuma",
  aliases: ["antiss"],
  usage: "$antimass",
  async execute(msg, args) {
    const userPermission =
      msg.member.hasPermission("MANAGE_GUILD") ||
      msg.member.hasPermission("ADMINISTRATOR");

    if (!userPermission)
      return msg.reply("Você não pode ativar ou desativar o antiLink");
    let guild = await guilds.indexGuild(msg.guild.id);

    const antiMass = args.shift();
    const availableAntiMass = ["umentions", "cmentions", "rmentions"];

    if (!antiMass || availableAntiMass.indexOf(antiMass) == -1)
      return msg.reply(
        `Estes são os antimass disponíveis:  \`${availableAntiMass.join(
          ", "
        )}\``
      );

    if (antiMass == "umentions") {
      const antiMassUMentions = !guild.messageProtector.antiMassUserMention;
      await guild.updateOne({
        "messageProtector.antiMassUserMention": antiMassUMentions,
      });

      if (antiMassUMentions)
        return msg.reply(
          `O antimass de menção de usuários foi ativado. O máximo de menções em uma mensagem é de ${
            guild.messageProtector.maxUsersMentions || 5
          } usuários.`
        );

      return msg.reply("O antimass de menção de usuários foi desativado.");
    } else if (antiMass == "cmentions") {
      const antiMassCMentions = !guild.messageProtector.antiMassChannelMention;
      await guild.updateOne({
        "messageProtector.antiMassChannelMention": antiMassCMentions,
      });

      if (antiMassCMentions)
        return msg.reply(
          `O antimass de menção de canais foi ativado. O máximo de menções em uma mensagem é de ${
            guild.messageProtector.maxChannelsMentions || 5
          } canais.`
        );

      return msg.reply("O antimass de menção de canais foi desativado.");
    } else if (antiMass == "rmentions") {
      const antiMassRMentions = !guild.messageProtector.antiMassRoleMention;
      await guild.updateOne({
        "messageProtector.antiMassRoleMention": antiMassRMentions,
      });

      if (antiMassRMentions)
        return msg.reply(
          `O antimass de menção de cargos foi ativado. O máximo de menções em uma mensagem é de ${
            guild.messageProtector.maxRolesMentions || 5
          } cargos.`
        );

      return msg.reply("O antimass de menção de cargos foi desativado.");
    }
  },
};
