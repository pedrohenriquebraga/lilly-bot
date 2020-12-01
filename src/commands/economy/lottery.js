const lilly = require("../../controllers/lillyController");
const emojis = require("../../../emojis.json");

module.exports = {
  name: "lottery",
  description: "Veja e participe da lotería da Lilly (Lillery)",
  args: false,
  guildOnly: true,
  economy: true,
  premium: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["loteria", "lillery"],
  usage: "$lottery (?comprar)",
  async execute(msg, args, bot) {
    if (!args[0]) {
      const lotteryStats = await lilly.getLotteryStats();
      const lastWinners = [];

      lotteryStats["lastWinners"].map(async (winnerId) => {
        const winner = await bot.users.cache.get(winnerId).username;
        return lastWinners.push(winner);
      });

      const lotteryEmbed = {
        title: "Veja informações da Lillery",
        description:
          "Veja algumas informações sobre o último sorteio e próximo que virá!!",
        fields: [
          {
            name: `${emojis.aMoney} Prêmio acumulado`,
            value: lotteryStats["accumulatedMoney"] + " DinDins",
          },
          {
            name: `${emojis.dindins} Prêmio atual`,
            value: lotteryStats["currentAward"] + " DinDins",
          },
          {
            name: `${emojis.members} Participantes no sorteio atual`,
            value: lotteryStats["participants"] + " Participantes",
          },
          {
            name: "🔢 Últimos números sorteados",
            value: `\`${
              lotteryStats["lastNumbers"].join(" | ") || "Não houve números!"
            }\``,
          },
          {
            name: `${emojis.aCrown} Últimos ganhadores`,
            value: `\`${lastWinners.join(", ") || "Não houve ganhadores"}\``,
          },
        ],
      };

      return msg.reply("", { embed: lotteryEmbed });
    }
  },
};
