const memesBuilder = require('../../../lilly-munch/memes/memesBuilder')

module.exports = {
  name: "stonks",
  description: "Crie seu meme stonks!!",
  args: true,
  guildOnly: true,
  economy: false,
  premium: false,
  fun: true,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: [],
  usage: "$stonks (frase)",
  async execute(msg, args) {
    return memesBuilder(msg, args, "stonks")
  },
};
