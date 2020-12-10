const upgrades = require("./upgrades.json");
const members = require("../../controllers/membersController");
const machines = require("../../controllers/machineController");
const emojis = require("../../../emojis.json");

module.exports = {
  name: "upgrade",
  description: "Dê upgrades em suas máquinas",
  args: false,
  guildOnly: true,
  economy: true,
  premium: false,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: ["up", "melhorar"],
  usage: "$upgrade (?id do upgrade)",
  async execute(msg, args, bot) {
    if (!args[0]) {
      const halitaEmoji = emojis.halita;
      const dindinsEmoji = emojis.dindins;
      const allMachines = await machines.getAllMachines(msg.author.id);

      console.log(allMachines);

      if (!allMachines.halita && !allMachines.dindin)
        return msg.reply(
          "**Você não possui máquinas para melhorar, por favor compre uma no `$shop`!**"
        );

      const upgradeEmbed = {
        color: "#ff0092",
        title: `${emojis.aUp1} | Upgrades da Lilly`,
        description: "Compre melhorias para suas máquinas aqui!",
        thumbnail: {
          url: bot.user.avatarURL(),
        },
        fields: [],
      };

      for (item of upgrades.items) {
        if (allMachines[item.machine])
          upgradeEmbed.fields.push({
            name:
              "**🆔 | `" +
              item.id +
              "`  " +
              `${item.name} | ${allMachines[item.machine].level} ${
                emojis.aArrow1
              } ${allMachines[item.machine].level + 1}**`,
            value: `*${item.description}*\n**${dindinsEmoji} ${
              item.baseCost * allMachines[item.machine].level
            } Dindins**`,
          });
      }

      return msg.reply("", { embed: upgradeEmbed });
    }

    const buyId = parseInt(args.shift());
    if (buyId >= upgrades.items.length)
      return msg.reply("**Por favor, informe um ID válido!**");

    const member = await members.indexMember(msg.author.id);
    switch (buyId) {
      case 0:
        const hasMachine = await machines.hasMachine(msg.author.id, "halita");
        const upgradeCost =
          upgrades.items[0].baseCost * member.machines.items["halita"].level;
        const currentLevel = member.machines.items.halita.level + 1;

        if (!hasMachine)
          return msg.reply(
            "**Você não tem o Gerador de Halitas. Compre uma no `$shop`!**"
          );

        if (member.money < upgradeCost)
          return msg.reply(
            `**Você não possuí DinDins suficientes para a compra!! Consiga mais \`${
              upgradeCost - member.money
            } DinDins\`!!**`
          );

        if (currentLevel > 5)
            return msg.reply('**Você só pode dar upgrades até o nível 5!!**')

        await member.update({
          money: member.money - upgradeCost,
          "machines.items.halita.level": currentLevel,
        });

        return msg.reply(
          `**Seu Gerador de Halitas foi para o level ${currentLevel}. Agora ela está gerando \`${(0.001 * currentLevel).toFixed(3)} Halitas\` por hora!**`
        );

      case 1:
          return msg.reply("**Em breve você poderá dar upgrade nesta máquina!**")
      default:
        return msg.reply(
          "**Não foi possível realizar seu upgrade, escolha um item válido!**"
        );
    }
  },
};
