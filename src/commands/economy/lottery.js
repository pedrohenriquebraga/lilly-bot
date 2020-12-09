const lilly = require("../../controllers/lillyController");
const members = require("../../controllers/membersController");
const emojis = require("../../../emojis.json");
const { converterNumber } = require("../../../utils/numberConverter");

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
  usage: "$lottery (?comprar) (valor da aposta) (3 números de 1 a 15)",
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
            value: lotteryStats["currentAward"] + " DinDins (+acumulado)",
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

    const buyAliases = ["buy", "comprar", "c", "b"];
    const action = args.shift().toLowerCase();
    const betAmount = converterNumber(args.shift());
    const numbers = args.map((number) => converterNumber(number));

    if (buyAliases.indexOf(action) === -1)
      return msg.reply(
        `\`${action}\` não é reconhecido!!`
      );

    if (!betAmount || betAmount < 500)
      return msg.reply(
        "**Aposte um valor válido e de pelo menos 500 DinDins!**"
      );
    if (numbers.length == 0)
      return msg.reply("**Informe números para concluir sua aposta!!**");

    for (number of numbers) {
      if (isNaN(number) || number > 15 || number < 1)
        return msg.reply("**Informe números de 1 a 15 válidos!**");
    }

    const member = await members.indexMember(msg.author.id);

    if (member.money < betAmount)
      return msg.reply(
        `Você não possuí DinDins suficientes para apostar!! **Consiga mais \`${
          betAmount - member.money
        } DinDins\` para concluir a aposta!**`
      );

    if (member.lottery.isParticipating)
      return msg.reply(
        "**Você já está participando deste sorteio, por favor aguarde!**"
      );

    await lilly.addNewParticipants(betAmount);
    await member.update({
      money: member.money - betAmount,
      "lottery.isParticipating": true,
      "lottery.betAmount": betAmount,
      "lottery.selectNumbers": numbers,
    });

    return msg.reply(
      "**Sua aposta foi feita com sucesso!!** Os sorteios acontecem às 00:00 e ao 12:00 (Horário de Brasília)!"
    );
  },
};
