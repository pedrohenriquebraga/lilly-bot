const guilds = require("../../controllers/guildsController");
const members = require("../../controllers/membersController")
const lilly = require("../../../lilly.json")

module.exports = {
  name: "botinfo",
  description: "Mostra informações do Bot",
  args: false,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["infobot", "bot"],
  usage: "$botinfo",
  async execute(msg, args, bot) {
    const guild = await guilds.indexGuild(msg.guild.id)

    let uptime = bot.uptime / 1000;

    const daysUptime = Math.floor(uptime / 86400);
    uptime %= 86400;

    const hoursUptime = Math.floor(uptime / 3600);
    uptime %= 3600;

    const minutesUptime = Math.floor(uptime / 60);

    const botInfoEmbed = {
      color: "#ff0092",
      title: "Informações da Lilly",
      description: "Veja aqui algumas informações da Lilly",
      thumbnail: {
        url: bot.user.avatarURL()
      },
      fields: [
        {
          name: "🤖 Nome do Bot",
          value: "`" + bot.user.username + "`",
        },
        {
          name: "▶ Criado por",
          value: "`GameSantosBr#8903`",
        },
        {
          name: "👨‍👩‍👦‍👦 Está sendo usado por",
          value: `${await bot.guilds.cache.size} servidores`,
        },
        {
          name: "*️⃣ Prefixo do Servidor",
          value: "`" + guild.guildPrefix + "`",
        },
        {
          name: "🧑 Total de usuários registrados",
          value: `${await members.countRegisterMembers()} usuários`,
        },
        {
          name: "💵 DinDins em circulação",
          value: `${await members.getTotalDinDins()} DinDins`,
        },
        {
          name: "▶ Comandos executados",
          value: `**${lilly.dailyCommands}** comandos`,
        },
        {
          name: "🔗 Avatar do Bot",
          value: `[Baixe aqui](${bot.user.avatarURL()})`,
        },
        {
          name: "🌐 Tempo Online",
          value: `${daysUptime} dias, ${hoursUptime} horas e ${minutesUptime} minutos`,
        },
      ],
    };

    return msg.reply("", { embed: botInfoEmbed });
  },
};
