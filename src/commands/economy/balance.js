const members = require("../../controllers/membersController");
const Discord = require("discord.js");

module.exports = {
  name: "balance",
  description: "Mostra seu saldo de DinDins e Halitas",
  args: false,
  guildOnly: true,
  economy: true,
  premium: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["saldo", "bal"],
  usage: "$balance",
  async execute(msg, args, bot) {
    let user

    const halitaEmoji = bot.emojis.cache.find(emoji => emoji.name === "lilly_halita") || ''
    const dindinsEmoji = bot.emojis.cache.find(emoji => emoji.name === "lilly_dindin") || ''
    try { user = await bot.users.fetch(args[0])}
    catch { user = msg.mentions.members.first() || msg.author }

    if (!user)
      return msg.reply("**Não a um usuário para que eu mostre o saldo!!**");

    const userId = user.id;

    const member = await members.indexMember(userId);
    if (member) {
      const balanceEmbed = new Discord.MessageEmbed()
        .setColor("#ff0092")
        .setTitle(`💰 Lilly's Bank`)
        .addField(`${dindinsEmoji} DinDins`, `${member.money}`, true)
        .addField(`${halitaEmoji} Halitas`, ` ${member.specialMoney}`, true)
        .setFooter("Com muito amor ❤ | Lilly");
      return msg.channel.send(
        `${msg.author}, Veja o saldo de <@${userId}>`,
        balanceEmbed
      );
    }
  },
};
