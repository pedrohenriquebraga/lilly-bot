const shop = require('../../../shop.json')

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
    const halitaEmoji = bot.emojis.cache.find(emoji => emoji.name === "lilly_halita") || ''
    const dindinsEmoji = bot.emojis.cache.find(emoji => emoji.name === "lilly_dindin") || ''
    const shopEmbed = {
      color: "#ff0092",
      title: "🏪 | Lojinha da Lilly",
      description: "Compre aqui os melhores produtos que só a Lilly tem (ainda não é possível realizar as compras)!!",
      thumbnail: {
        url: bot.user.avatarURL(),
      },
      fields: [],
    };

    for (item of shop.items) {
        shopEmbed.fields.push({
            name: '**🆔 | `' + item.id + '`  ' + `${item.name}**`,
            value: `*${item.description}*\n**${dindinsEmoji} ${item.cost.dindins} Dindins e ${halitaEmoji} ${item.cost.halitas} Halitas**`
        })
    }

    msg.reply('', {embed: shopEmbed})
  },
};
