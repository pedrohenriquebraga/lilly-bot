const axios = require("axios");

module.exports = {
  name: "searchyt",
  description: "Faça buscas de vídeos no YouTube diretamente do Discord",
  args: true,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["procuraryt", "schyt"],
  usage: "$searchyt (busca)",
  async execute(msg, args) {
    let error = false
    const videos = await axios.get(
      `https://content-youtube.googleapis.com/youtube/v3/search?q=${args.join(' ')}&part=snippet&key=${process.env.YOUTUBE_SEARCH_API_TOKEN}&max_results=10&type=video`
    )
    .then(response => response.data)
    .catch(err => error = true)

    if (error) return msg.reply("Infelizmente eu não consegui falar com meu amiguinho **YouTube**, quem sabe mais tarde!")

    if (!videos) return msg.reply('Parece que não existe vídeos para esta busca!')

    let videosEmbed = {
        title: `<:youtube:766278798286520330> Resultado da busca \`${args.join(" ")}\``,
        description: "**Veja os vídeos que eu encontrei no YouTube:**\n\n",
        footer: {
            text: `Busca realizada por ${msg.author.username}`,
            icon_url: `${msg.member.user.avatarURL()}`,
        }
    }

    for (video of videos.items) {
        let videoId = video.id.videoId
        let videoTitle = video.snippet.title
        let videoUrl = `https://youtu.be/${videoId}`

        videosEmbed.description += `▶ **[${videoTitle}](${videoUrl})**\n`
    }

    return msg.reply('', {embed: videosEmbed})
  },
};
