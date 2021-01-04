const guilds = require("../../controllers/guildsController");

module.exports = {
  name: "linkchannels",
  description: "Define um canal onde é permitido enviar links.",
  args: true,
  guildOnly: true,
  economy: false,
  premium: false,
  userPermissions: "Gerenciar o servidor",
  lillyPermissions: "Nenhuma",
  aliases: ["linknnels"],
  usage: "$linkchannels  <add ou remove> <?canal>",
  async execute(msg, args, bot) {
    const action = args[0] ? args[0].toLowerCase().trim() : "";

    if (action != "add" && action != "remove")
      return msg.reply(
        `**Informe se você quer remover canais (com o argumento \`del\`) ou adicionar (com o argumento \`remove\`)!**`
      );

    const userPermission =
      msg.member.hasPermission("MANAGER_GUILD") ||
      msg.member.hasPermission("ADMINISTRATOR");
    const linkChannelId = msg.mentions.channels.array().shift() || msg.channel;

    if (!userPermission)
      return msg.reply(
        "**Você não tem permissão de alterar o canal de mensagens excluídas!!**"
      );

    if (!linkChannelId.id)
      return msg.reply(
        "**Informe um canal válido para definir como meu canal de mensagens excluídas!!**"
      );

    const guild = await guilds.indexGuild(msg.guild.id);
    const allowedLinksChannels =
      guild.messageProtector.allowedLinksChannelsId || [];

    if (
      allowedLinksChannels.indexOf(linkChannelId.id) != -1 &&
      action == "add"
    ) {
      return msg.reply(
        `**O canal <#${linkChannelId.id}> já está na lista de canais permitidos!**`
      );
    } else if (
      allowedLinksChannels.indexOf(linkChannelId.id) == -1 &&
      action == "add"
    ) {
      allowedLinksChannels.push(linkChannelId.id);
      await guild.updateOne({
        "messageProtector.allowedLinksChannelsId": allowedLinksChannels,
      });
      return msg.reply(`**O canal <#${linkChannelId.id}> foi adicionado na lista de permitidos**`);
    }

    if (
      action == "remove" &&
      allowedLinksChannels.indexOf(linkChannelId.id) == -1
    ) {
      return msg.reply(`**O canal <#${linkChannelId.id}> não está na lista!**`);
    } else if (
      action == "remove" &&
      allowedLinksChannels.indexOf(linkChannelId.id) != -1
    ) {
      allowedLinksChannels.splice(
        allowedLinksChannels.indexOf(linkChannelId.id),
        1
      );
      await guild.updateOne({
        "messageProtector.allowedLinksChannelsId": allowedLinksChannels,
      });
      return msg.reply(
        `**O canal <#${linkChannelId.id}> foi removido na lista de permitidos**`
      );
    }
  },
};
