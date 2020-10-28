const Discord = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Mostra informações do server",
  guildOnly: false,
  args: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  usage: "$serverinfo",
  aliases: ["infoservidor", "servidor", "server"],
  execute(msg, args) {
    const date = new Date();
    const actuallyYear = date.getFullYear();

    const createdAt = msg.guild.createdAt.toString();
    const dateCreate = createdAt.split(" ");

    const yearCreate = parseInt(actuallyYear) - parseInt(dateCreate[3]);

    const serverInfoEmbed = new Discord.MessageEmbed()
      .setColor("#ff0092")
      .setTitle("📝 Informações do Server")
      .setDescription("Aqui estão algumas informações deste servidor")
      .setThumbnail(msg.guild.iconURL())
      .addFields(
        { name: "🏷️ Nome do Servidor", value: `${msg.guild.name}` },
        {
          name: "👥 Total de Membros",
          value: `${msg.guild.memberCount} membros`,
        },
        {
          name: "👑 Dono do Servidor",
          value: "``" + msg.guild.owner.user.username || '<< Desconhecido >>' + "``",
        },
        {
          name: "📅 Criado há",
          value: `${yearCreate} ano(s) atrás às ${dateCreate[4]}`,
        },
        { name: "🌎 Região", value: `${msg.guild.region.toUpperCase()}` }
      );

    msg.reply("", serverInfoEmbed);
  },
};
