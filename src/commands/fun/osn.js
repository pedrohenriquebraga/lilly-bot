const memesBuilder = require('../../../lilly-plugins/lilly-munch/memes/memesBuilder')

module.exports = {
  name: "osn",
  description: "Crie seu meme 'Ou será que não?'",
  args: true,
  guildOnly: true,
  economy: false,
  premium: false,
  fun: true,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ['ouseraquenao'],
  usage: "$osn (frase)",
  async execute(msg, args) {
    return memesBuilder(msg, args, "ouseraquenao")
  },
};
