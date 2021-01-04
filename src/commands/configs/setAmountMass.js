const guilds = require("../../controllers/guildsController");
const { converterNumber } = require("../../../utils/numberConverter");

module.exports = {
  name: "setamountmass",
  description: "Defina a quantidade de menções de usuários, cargos e canais permitidas em uma mensagem",
  args: false,
  guildOnly: true,
  economy: false,
  premium: false,
  fun: false,
  userPermissions: "Gerenciar o servidor",
  lillyPermissions: "Nenhuma",
  aliases: ["defineqtdmass", 'setamomass'],
  usage: "$setamountmass (mass) (quantidade)",
  async execute(msg, args) {
    const userPermission =
      msg.member.hasPermission("MANAGE_GUILD") ||
      msg.member.hasPermission("ADMINISTRATOR");

    if (!userPermission) return msg.reply("Você alterar essas quantidades!");
    let guild = await guilds.indexGuild(msg.guild.id);

    const antiMass = args.shift();
    const amountMentions = converterNumber(args[0]);
    const availableAntiMass = ["umentions", "cmentions", "rmentions"];

    if (!antiMass || availableAntiMass.indexOf(antiMass) == -1)
      return msg.reply(
        `Estes são os antimass disponíveis:  \`${availableAntiMass.join(
          ", "
        )}\``
      );

    if (antiMass == "umentions") {
      if (amountMentions <= 0 || isNaN(amountMentions))
        return msg.reply("**Escolha um número válido!**");

      await guild.updateOne({
        "messageProtector.maxUsersMentions": amountMentions,
      });

      return msg.reply(
        `O máximo de menções de usuários em uma mensagem agora é de \`${amountMentions} membros\`!`
      );
    } else if (antiMass == "cmentions") {
      if (amountMentions <= 0 || isNaN(amountMentions))
        return msg.reply("**Escolha um número válido!**");

      await guild.updateOne({
        "messageProtector.maxChannelsMentions": amountMentions,
      });

      return msg.reply(
        `O máximo de menções de canais em uma mensagem agora é de \`${amountMentions} canais\`!`
      );
    } else if (antiMass == "rmentions") {
      if (amountMentions <= 0 || isNaN(amountMentions))
        return msg.reply("**Escolha um número válido!**");

      await guild.updateOne({
        "messageProtector.maxRolesMentions": amountMentions,
      });

      return msg.reply(
        `O máximo de menções de cargos em uma mensagem agora é de \`${amountMentions} cargos\`!`
      );
    }
  },
};
