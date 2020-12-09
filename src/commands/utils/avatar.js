const Discord = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Mostra o avatar do usuário",
  args: false,
  guildOnly: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["showavatar", "fotoperfil", "avt", "perfil"],
  usage: "$avatar (?usuário)",
  async execute(msg, args, bot) {
    let idMember;
    let user;

    if (args[0]) {
      idMember = args
        .shift()
        .split("")
        .filter((num) => Number(num) || num == 0)
        .join("");
    }

    try {
      user = await bot.users.fetch(idMember);
    } catch {
      user = msg.mentions.users.first() || msg.author;
    }

    const serverInfoEmbed = new Discord.MessageEmbed()
      .setColor("#ff0092")
      .addField(
        `⬇ Baixe o avatar de ${user.username}`,
        `**[Clique aqui!](${user.avatarURL({
          format: "png",
          dynamic: true,
          size: 512,
        })})**`
      )
      .setImage(
        user.avatarURL({
          dynamic: true,
          size: 512,
        })
      );
    msg.reply("", serverInfoEmbed);
  },
};
