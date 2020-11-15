const Discord = require("discord.js");
const emojis = require("../../../utils/lillyEmojis")[0]

module.exports = {
  name: "serverinfo",
  description: "Mostra informações do server",
  guildOnly: false,
  args: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  usage: "$serverinfo",
  aliases: ["infoservidor", "servidor", "server"],
  async execute(msg, args, bot) {
    const botGuild = await bot.guilds.cache.get(msg.guild.id)
    const date = new Date();
    
    const createdAt = msg.guild.createdAt.toString();
    const dateCreate = createdAt.split(" ");
    const yearCreate = parseInt(date.getFullYear()) - parseInt(dateCreate)
    const textChannels = msg.guild.channels.cache.filter(c => c.type === "text").size
    const voiceChannels = msg.guild.channels.cache.filter(c => c.type === "voice").size

    let guildOwner = botGuild.owner.displayName || msg.guild.owner.user.username
    let botCount = botGuild.members.cache.filter(m => m.user.bot === true).size

    const serverInfoEmbed = new Discord.MessageEmbed()
      .setColor("#ff0092")
      .setTitle(`${emojis.discordIcon} ${msg.guild.name}`)
      .setDescription("Aqui estão algumas informações deste servidor:")
      .setThumbnail(msg.guild.iconURL())
      .addFields(
        { name: "🏷️ Nome do Servidor", value: `${msg.guild.name}` },
        {
          name: "👥 Total de Membros",
          value: `${msg.guild.memberCount - botCount} membro(s) e ${botCount} bot(s)`,
        },
        {
          name: "👑 Dono do Servidor",
          value: "*`" + guildOwner + "`*",
        },
        {
          name: "📅 Criado há",
          value: `${yearCreate} ano(s) atrás às ${dateCreate[4]}`,
        },
        {
          name: `#️⃣ (${textChannels + voiceChannels}) Canais`,
          value: '**`' + `📝 ${textChannels} de textos \n🔊 ${voiceChannels} de voz` + '`**' 
        },
        { name: "🌎 Região", value: `${msg.guild.region.toUpperCase()}` }
      );

    msg.reply("", serverInfoEmbed);
  },
};
