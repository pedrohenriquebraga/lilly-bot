const guilds = require("../../controllers/guildsController");

module.exports = {
  name: "color",
  description:
    "Muda a cor do nome do usuário. Digite '$color' para saber as cores.",
  args: false,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Gerenciar cargos",
  aliases: ["cor", "cornome"],
  usage: "$color (?cor)",
  async execute(msg, args, bot) {
    const guild = await guilds.indexGuild(msg.guild.id);
    const availableColors = [
      "red",
      "green",
      "blue",
      "orange",
      "yellow",
      "white",
      "black",
    ];

    if (!guild["changeColor"])
      return msg.reply("**Este servidor não permite a mudança de cor!!**");

    if (!args[0]) {
      let colorEmbed = {
        title: "🎨 | Veja às cores disponíveis",
        description: "Veja às cores disponíveis para uso no momento:\n",
        footer: {
          text: "⚪ Use o comando $color (cor) para definir uma cor",
        },
      };

      availableColors.map(
        (color) => (colorEmbed.description += `**🌟 ${color}**\n`)
      );
      return msg.reply("", { embed: colorEmbed });
    }

    if (availableColors.indexOf(args[0]) == -1)
      return msg.reply("**Eu não encontrei esta cor!!**");

    let role = await msg.guild.roles.cache.find(
      (role) => role.name == `${args[0]}color`
    );
    args[0] = args[0].toLowerCase();

    if (!role) {
      await msg.guild.roles.create({
        data: {
          name: `${args[0]}color`,
          color: args[0].toUpperCase(),
          position: 0
        },
      });
      role = await msg.guild.roles.cache.find(
        (role) => role.name == `${args[0]}color`
      );
    }

    for (color of availableColors) {
      if (msg.member.roles.cache.find((r) => r.name == `${color}color`)) {
        const role = msg.member.roles.cache.find(
          (r) => r.name == `${color}color`
        ).id;
        msg.member.roles.remove(role);
      }
    }

    return msg.member.roles
      .add(role)
      .then(() => {
        msg.reply(`Sua cor agora é **${args[0]}**`);
      })
      .catch((err) => console.error("Erro ao trocar de cor: ", err));
  },
};
