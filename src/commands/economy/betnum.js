const members = require("../../controllers/membersController");
const { converterNumber } = require("../../../utils/numberConverter")

module.exports = {
  name: "betnum",
  description: "Aposte com a Lilly em qual número ela pensará entre 1 e 5.",
  args: true,
  guildOnly: false,
  economy: true,
  premium: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["apostanum"],
  usage: "$betnum (número) (valor da aposta)",
  async execute(msg, args) {
    const suggestedNumber = parseInt(args.shift());
    const stakeValue = converterNumber(args.shift());
    const generatedNumber = Math.floor(Math.random() * 5) + 1;

    // Verifica se os valores informados são válidos

    if (!suggestedNumber || suggestedNumber < 1 || suggestedNumber > 5)
      return msg.reply(
        "**Informe um número que você acha que pensei, entre 1 e 5!!**"
      );

    if (!stakeValue || stakeValue < 10)
      return msg.reply("**Aposte um valor de no mínimo 10 DinDins!!**");

    const member = await members.indexMember(msg.author.id);
    const currentMoney = await member.money;

    if (currentMoney < stakeValue)
      return msg.reply(
        `**Você não possuí ${stakeValue} DinDins para apostar!!**`
      );

    await members.updateDataMembers(
      { memberId: msg.author.id },
      { money: currentMoney - stakeValue }
    );

    // Verifica se a pessoas perdeu, ganhou ou quase ganhou

    const differenceNumber = generatedNumber - suggestedNumber;
    if (differenceNumber == 1 || differenceNumber == -1) {
      const earnMoney = currentMoney - Math.floor(stakeValue / 2);

      await members.updateDataMembers(
        { memberId: msg.author.id },
        { money: earnMoney }
      );

      return msg.reply(
        `**Você quase acertou**, eu pensei no número **${generatedNumber}** e você no **${suggestedNumber}**!! Por quase ter acertado, tome **${Math.floor(stakeValue / 2)} DinDins de volta!!**`
      );
    }

    if (differenceNumber == 0) {
      const earnMoney = currentMoney + stakeValue;

      await members.updateDataMembers(
        { memberId: msg.author.id },
        { money: earnMoney }
      );

      return msg.reply(
        `**Você acertou!!** Por ter acertado você ganha **${stakeValue} DinDins!!**`
      );
    }

    return msg.reply(
      `**Você errou!!** Eu pensei no número **${generatedNumber}**, por isso você perdeu **${stakeValue} DinDins!!**`
    );
  },
};
