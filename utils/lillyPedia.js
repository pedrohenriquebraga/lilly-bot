const config = require("../config.json");

function LillyPediaEmbed(command, msg) {
  return {
    title: `📖 LillyPedia | ${command.name}`,
    description: command.description,
    url: config.websiteURL + "/commands",
    fields: [
      {
        name: "🛠 Como usar:",
        value: `\`${command.usage}\``,
      },
      {
        name: "🔀 Atalhos para o comando",
        value: `\`${command.aliases.join(", ") || "Nenhum"}\``,
      },
      {
        name: "🚫 Permissões da Lilly",
        value: `\`${command.lillyPermissions}\``,
      },
      {
        name: "🚫 Permissões do usuário",
        value: `\`${command.userPermissions}\``,
      },
      {
        name: "🔵 Veja mais comandos!!",
        value: `[Acesse o site da Lilly e veja todos os comandos](${
          config.websiteURL + "/commands"
        })`,
      },
    ],

    timestamp: new Date(),
    footer: {
      text: `Espero ter te ajudado ${msg.author.username}`,
      icon_url: msg.member.user.avatarURL(),
    },
  };
}

module.exports = LillyPediaEmbed;
