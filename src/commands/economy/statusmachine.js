const members = require("../../controllers/membersController");
const emojis = require("../../../emojis.json");

module.exports = {
  name: "statusmachines",
  description: "Vê os status das máquinas.",
  args: false,
  guildOnly: true,
  economy: true,
  premium: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["stmchs", "smachines", "statusmaquina"],
  usage: "$statusmachines",
  async execute(msg, args) {
    const statusEmbed = {
      title: "<:gerador_halita:779856127633915914> Status das máquinas",
      description: "Aqui você vê se suas máquinas estão funcionando ou paradas!!",
      fields: [
        {
          name: "Halitas",
          value: `${emojis.aNo || "❌"} Parada`,
          inline: true,
        },

        {
          name: "DinDins",
          value: `${emojis.aNo || "❌"} Parada`,
          inline: true,
        },
      ],
    };

    const member = await members.indexMember(msg.author.id);
    const machines = [member.machines]; // Array de máquinas

    for (machine of machines) {
      if (machine.items.halita) {
         machine.items.halita.isActive
           ? (statusEmbed.fields[0].value = `${emojis.aYes || "✔"} Funcionando`)
           : (statusEmbed.fields[0].value = `${emojis.aNo || "❌"} Parada`);
      }

      if (machine.items.dindin) {
         machine.items.dindin.isActive || false
           ? (statusEmbed.fields[1].value = `${emojis.aYes || "✔"} Funcionando`)
           : (statusEmbed.fields[1].value = `${emojis.aNo || "❌"} Parada`);
      }
    }

    return msg.reply("", { embed: statusEmbed });
  },
};
