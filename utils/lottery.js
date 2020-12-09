async function startLottery(bot) {
  const date = new Date();
  const time =
    (date.getHours() == 12 && date.getMinutes() == 00) ||
    (date.getHours() == 0 && date.getMinutes() == 0);

  if (!time) return;

  const members = require("../src/controllers/membersController");
  const lilly = require("../src/controllers/lillyController");
  const getAllParticipants = await members.getAllParticipantsLottery();

  if (!getAllParticipants) return
  if (getAllParticipants.length == 1) return

  const genNumbers = [];
  const totalAward = await lilly.getTotalAward();
  const winnersId = [];
  let totalWinners = 0;

  for (let time = 0; time < 3; time++) {
    let num = Math.floor(Math.random() * 15 + 1);
    while (genNumbers.indexOf(num) != -1)
      num = Math.floor(Math.random() * 15 + 1);
    genNumbers.push(num);
  }

  for (participant of getAllParticipants) {
    const selectNumbers = participant.lottery.selectNumbers;
    let win = 0;
    for (number of selectNumbers) if (genNumbers.indexOf(number) != -1) win++;

    if (win == 3) {
      totalWinners++;
      winnersId.push(participant.memberId);
    }
  }

  if (winnersId.length == 0 || totalWinners == 0) {
    console.log("[ Não houve ganhadores ]");
    lilly.finishLottery(winnersId, totalAward, genNumbers);

    for (member of getAllParticipants) {
      await members.finishLottery(member.memberId, 0);
    }
    return;
  }

  console.log(`[ Houveram ${totalWinners} ganhadores ]`);
  const separatedAward = Math.floor(totalAward / totalWinners);

  for (winnerId of winnersId) {
    const discordUser = await bot.users.cache.get(winnerId);
    await members.finishLottery(winnerId, separatedAward);
    discordUser.send(
      `**Parabéns!!** Você ganhou o sorteio da Lillery com os números \`${genNumbers.join(
        ","
      )}\`. Você teve que dividir o prêmio de \`${totalAward}\` DinDins com \`${totalWinners}\` ganhadores, ficando assim com \`${separatedAward}\` DinDins!`
    );
  }

  return await lilly.finishLottery(winnersId, 0, genNumbers);
}

module.exports = startLottery;
