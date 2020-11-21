const memesBuilder = require('../../../lilly-munch/memes/memesBuilder')

module.exports = {
  name: "notstonks",
  description: "Crie seu meme 'Not Stonks'!!",
  args: true,
  guildOnly: true,
  economy: false,
  premium: false,
  fun: true,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["nstonks"],
  usage: "$notstonks (frase)",
  async execute(msg, args) {
    return memesBuilder(msg, args, "notstonks")
  },
};
