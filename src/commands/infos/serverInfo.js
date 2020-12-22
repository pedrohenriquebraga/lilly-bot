const Discord = require("discord.js");
const emojis = require("../../../emojis.json")

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
    const discordIcon = emojis.discord_icon
    const botGuild = await bot.guilds.cache.get(msg.guild.id)
      date = new Date();
      createdAt = botGuild.createdAt.toString();
      dateCreate = createdAt.split(" ");
      yearCreate = parseInt(date.getFullYear()) - parseInt(dateCreate[3])
      textChannels = botGuild.channels.cache.filter(c => c.type === "text").size
      voiceChannels = botGuild.channels.cache.filter(c => c.type === "voice").size

    let guildOwner = botGuild.owner.user.username
    let botCount = botGuild.members.cache.filter(m => m.user.bot === true).size

    const serverInfoEmbed = new Discord.MessageEmbed()
      .setColor("#ff0092")
      .setTitle(`${discordIcon} ${botGuild.name}`)
      .setDescription("Aqui estão algumas informações deste servidor:")
      .setThumbnail(botGuild.iconURL())
      .addFields(
        { name: "🏷️ Nome do Servidor", value: `${botGuild.name}` },
        {
          name: "👥 Total de Membros",
          value: `${botGuild.memberCount - botCount} membro(s) e ${botCount} bot(s)`,
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
        { name: "🌎 Região", value: `${botGuild.region.toUpperCase()}` }
      );

    msg.reply("", serverInfoEmbed);
  },
};
