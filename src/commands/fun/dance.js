const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");

module.exports = {
  name: "dance",
  description: "Escolha seu par para dançar",
  args: false,
  guildOnly: true,
  economy: false,
  premium: false,
  fun: true,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["dancar"],
  usage: "$dance (?usuário)",
  async execute(msg, args, bot) {
    let user;
    try {
      user = await bot.users.fetch(args[0]);
    } catch {
      user = msg.mentions.users.first() || bot.user;
    }

    const gifs = fs.readdirSync(
      path.join(__dirname, "..", "..", "..", "assets", "gifs", "dancing")
    );

    const selectedGif = Math.floor(Math.random() * gifs.length + 1);
    const gif = new Discord.MessageAttachment(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "assets",
        "gifs",
        "dancing",
        `dancando_${selectedGif}.gif`
      )
    );

    const danceEmbed = {
      description: `**🌟 | ${msg.author} está dançando com ${user}**`,
      image: {
        url: `attachment://dancando_${selectedGif}.gif`,
      },
    };

    return msg.reply("", { files: [gif], embed: danceEmbed });
  },
};
