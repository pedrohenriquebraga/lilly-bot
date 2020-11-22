const shop = require("./shop.json");
const members = require("../../controllers/membersController");
const machines = require("../../controllers/machineController")
const emojis = require("../../../utils/lillyEmojis")[0];

module.exports = {
  name: "shop",
  description: "Lojinha da Lilly",
  args: false,
  guildOnly: true,
  economy: true,
  premium: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["loja", "comprar"],
  usage: "$shop (?id da compra)",
  async execute(msg, args, bot) {
    if (!args[0]) {
      const halitaEmoji =
        bot.emojis.cache.find((emoji) => emoji.name === "lilly_halita") || "";
      const dindinsEmoji =
        bot.emojis.cache.find((emoji) => emoji.name === "lilly_dindin") || "💵";

      const shopEmbed = {
        color: "#ff0092",
        title: "🏪 | Lojinha da Lilly",
        description:
          "Compre aqui os melhores produtos que só a Lilly tem (ainda não é possível realizar as compras)!!",
        thumbnail: {
          url: bot.user.avatarURL(),
        },
        fields: [],
      };

      for (item of shop.items) {
        shopEmbed.fields.push({
          name: "**🆔 | `" + item.id + "`  " + `${item.name}**`,
          value: `*${item.description}*\n**${dindinsEmoji} ${item.cost.dindins} Dindins e ${halitaEmoji} ${item.cost.halitas} Halitas**`,
        });
      }

      return msg.reply("", { embed: shopEmbed });
    }

    const buyId = parseInt(args.shift());
    if (buyId >= shop.items.length)
      return msg.reply("**Por favor, informe um ID válido!**");

    switch (buyId) {
      case 0:
        const hasMachine = await machines.hasMachine(msg.author.id, 'halita')
        console.log(hasMachine);

        if (!hasMachine)
          return msg.reply('**Você não possuí o Gerador de Halitas!**')

        return msg.reply('**Você possuí o Gerador de Halitas!**')
      case 1:
        return msg.reply("**Este ítem está esgotado, volte amanhã!**");
      case 2:
        const member = await members.indexMember(msg.author.id);
        if (member.specialMoney == 0)
          return msg.reply("**Você não possuí Halitas para vender!!**");

        await members.removeHalitas(msg.author.id, 1);
        await members.addDinDins(msg.author.id, 10000);

        return msg.reply(
          `**Sua compra foi feita com sucesso!! Agora você possuí \`${
            member.money + 10000
          } DinDins\` e \`${member.specialMoney - 1} Halitas\`**`
        );
      case 3:
        return msg.reply("**Este ítem está esgotado, volte amanhã!**");
      default:
        return msg.reply(
          "**Não foi possível realizar sua compra, escolha um item válido!**"
        );
    }
  },
};
