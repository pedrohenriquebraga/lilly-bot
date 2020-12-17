const shop = require("./shop.json");
const members = require("../../controllers/membersController");
const machines = require("../../controllers/machineController");
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
        description: "Compre aqui os melhores produtos que só a Lilly tem!!",
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

    const member = await members.indexMember(msg.author.id);
    switch (buyId) {
      case 0:
        const hasHalitaMachine = await machines.hasMachine(
          msg.author.id,
          "halita"
        );
        if (member.money < shop.items[buyId].cost.dindins)
          return msg.reply(
            `**Você não tem DinDins suficientes para realizar a compra!** consiga mais \`${
              shop.items[buyId].cost.dindins - member.money
            } DinDins\`. `
          );

        if (hasHalitaMachine)
          return msg.reply("**Você já possuí esta maquína!**");
        await members.removeDinDins(
          msg.author.id,
          shop.items[buyId].cost.dindins
        );
        await machines.giveHalitaMachine(msg.author.id);
        return msg.reply("Você comprou o **Gerador de Halitas**!");

      case 1:
        const hasDinDinsMachine = await machines.hasMachine(
          msg.author.id,
          "dindin"
        );

        if (member.money < shop.items[buyId].cost.dindins)
          return msg.reply(
            `**Você não tem DinDins suficientes para realizar a compra!** consiga mais \`${
              shop.items[buyId].cost.dindins - member.money
            } DinDins\`. `
          );

        if (member.specialMoney < shop.items[buyId].cost.halitas)
          return msg.reply(
            `**Você não tem Halitas suficientes para realizar a compra!** consiga mais \`${
              shop.items[buyId].cost.halitas - member.specialMoney
            } Halitas\`. `
          );

        if (hasDinDinsMachine)
          return msg.reply("**Você já possuí esta maquína!**");
        await members.removeDinDins(
          msg.author.id,
          shop.items[buyId].cost.dindins
        );
        await members.removeHalitas(
          msg.author.id,
          shop.items[buyId].cost.halitas
        );
        await machines.giveHalitaMachine(msg.author.id);
        return msg.reply("Você comprou o **Caixa Eletrônico**!");

      case 2:
        if (member.specialMoney < 1)
          return msg.reply("**Você não possuí Halitas para vender!!**");

        await members.removeHalitas(msg.author.id, 1);
        await members.addDinDins(msg.author.id, 25000);

        return msg.reply(
          `**Sua compra foi feita com sucesso!! Agora você possuí \`${
            member.money + 25000
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
