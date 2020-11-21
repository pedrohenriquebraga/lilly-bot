const memesBuilder = require('../../../lilly-plugins/lilly-munch/memes/memesBuilder')

module.exports = {
  name: "tstn",
  description: "Crie seu meme 'Teoricamente sim, teoricamente não'",
  args: true,
  guildOnly: true,
  economy: false,
  premium: false,
  fun: true,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ['teoricamente'],
  usage: "$tstn (frase)",
  async execute(msg, args) {
    return memesBuilder(msg, args, "teoricamente")
  },
};
