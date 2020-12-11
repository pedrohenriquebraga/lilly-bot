const { generateDate } = require("../../../utils/utilsCommands");
const members = require("../../controllers/membersController");

module.exports = {
  name: "daily",
  description: "Pegue DinDins diariamente. Quanto mais cedo, mais ganha!",
  args: false,
  guildOnly: true,
  economy: true,
  premium: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["diaria"],
  usage: "$daily",
  async execute(msg, args, bot) {
    const dindinsEmoji =
      bot.emojis.cache.find((emoji) => emoji.name === "lilly_dindin") || "💵";
    const currentDate = generateDate(true).split("-");
    const member = await members.indexMember(msg.author.id);
    const valueDaily = Math.floor(
      8000 - (parseInt(currentDate[1].replace(":", "")) * 2)
    );

    if (!member.lastDaily) member["lastDaily"] = "";

    if (member.lastDaily == currentDate[0])
      return msg.reply("**Você já pegou seu daily hoje!! Volte amanhã!!**");

    try {
      await members.updateDataMembers(
        { memberId: msg.author.id },
        { money: member.money + valueDaily, lastDaily: currentDate[0] }
      );

      return msg.reply(
        `**${dindinsEmoji} | Você recebeu ${valueDaily} DinDins no daily!!**`
      );
    } catch (err) {
      console.error("Erro ao resgatar o daily: \n", err);
    }
  },
};
