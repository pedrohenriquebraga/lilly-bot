const { secondsToMs } = require("./utilsCommands");
const startLottery = require("./lottery")
const lilly = require("../lilly.json");
const config = require("../config.json");

module.exports = {
  statusUpdate(bot) {
    console.log("[ Iniciada a troca de status do bot ]");
    return setInterval(async () => {
      serversAmount = bot.guilds.cache.size;
      let status = [
        `Eu já estou em ${serversAmount} servidores!!`,
        `</> Já foram executados ${lilly.dailyCommands} comandos desde o último reinício!!`,
        `🌐 Acesse "${config.websiteURL}/commands" e veja meus comandos!`,
        `Me mencione e veja meu prefixo neste servidor!!`,
        `🔗 Entre no servidor de suporte: "https://discord.gg/SceHNfZ"`,
      ];

      await bot.user.setStatus("online");
      await bot.user.setActivity(
        status[Math.floor(Math.random() * status.length)]
      );
    }, secondsToMs(15));
  },
  workMachines(bot, members) {
    console.log("[ Máquinas iniciadas ]");
    return setInterval(async () => {
      const date = new Date();
      if (date.getMinutes() != 0) return;
      const machines = require("../src/controllers/machineController");
      const activeHalitaMachines = await machines.selectAllActiveHalitaMachines();
      if (!activeHalitaMachines) return;

      console.log(
        `[ ${activeHalitaMachines.length} máquinas estão em funcionamento ]`
      );

      for (machine of activeHalitaMachines) {
        const member = await members.indexMember(machine.memberId);
        const discordUser = await bot.users.cache.get(machine.memberId);

        if (machine.machines.items.halita.isActive) {
          const activeTime = machine.machines.items.halita.timeActive;
          const currentTime = activeTime - 1;
          const amountGiveHalita = machine.machines.items.halita.level * 0.001

          await members.addHalitas(machine.memberId, amountGiveHalita);
          if (currentTime > 0) {
            await member.updateOne({
              "machines.items.halita.timeActive": currentTime,
            });
          } else {
            await member.updateOne({ "machines.items.halita.timeActive": 0 });
            await member.updateOne({ "machines.items.halita.isActive": false });

            return discordUser.send(
              "**Sua máquina de Halita parou!! Volte e ative ela!**"
            );
          }
        }

        if (machine.machines.items.dindin.isActive) {
          const activeTime = machine.machines.items.dindin.timeActive;
          const currentTime = activeTime - 1;

          await members.addDinDins(machine.memberId, 80);

          if (currentTime > 0) {
            await member.updateOne({
              "machines.items.dindin.timeActive": currentTime,
            });
          } else {
            await member.updateOne({ "machines.items.dindin.timeActive": 0 });
            await member.updateOne({ "machines.items.dindin.isActive": false });

            return discordUser.send(
              "**Sua máquina de DinDins parou!! Volte e ative ela!**"
            );
          }
        }
      }
    }, secondsToMs(60))
  },

  lottery(bot) {
    console.log('[ Lotería iniciada ]');
    return setInterval(async () => {
      return await startLottery(bot)
    }, secondsToMs(60))
  }
};
