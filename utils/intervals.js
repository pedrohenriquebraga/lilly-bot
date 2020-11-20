const { secondsToMs } = require("../utils/utilsCommands");
const lilly = require("../lilly.json")
const config = require("../config.json")

module.exports = {
  statusUpdate(bot) {
    console.log('\033[1;32mIniciada a troca de status do bot\033[m')
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
};
