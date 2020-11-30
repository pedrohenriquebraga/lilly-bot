const members = require("../../controllers/membersController");
const emojis = require("../../../emojis.json")

module.exports = {
    name: 'desactivate',
    description: 'Desativa máquinas',
    args: true,
    guildOnly: true,
    economy: true,
    premium: false,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    aliases: ['desativar'],
    usage: '$desactivate (máquina)',
    async execute(msg, args) {
        if (!args)
            return msg.reply('**Informe a máquina a ser desativada!!**')

        const halitaAliases = ['halita', 'halitas', 'hl']
        const dindinAliases = ['dindin', 'dindins', 'dd']
        let selectedMachine = ''
        
        if (halitaAliases.indexOf(args[0]) > -1) selectedMachine = 'halita'
        else if (dindinAliases.indexOf(args[0]) > -1) selectedMachine = 'dindin'

        if (!selectedMachine)
            return msg.reply('**Informe uma máquina válida!!**')

        const member = await members.indexMember(msg.author.id);
        switch (selectedMachine) {
            case 'dindin':
                if (!member.machines.items.dindin.hasMachine)
                    return msg.reply('**Você naõ possuí está máquina!! Digite `$shop` e compre-a!**')
                if (!member.machines.items.dindin.isActive)
                    return msg.reply('**Está máquina já está desativada!! Digite `$stmchs` e saiba mais!**')
                await member.updateOne({ 'machines.items.dindin.isActive': false })
                await member.updateOne({ 'machines.items.dindin.timeActive': 0 })
                return msg.reply(`${emojis.switchDisable} **Máquina de DinDins desativada!!**`)
            case 'halita':
                if (!member.machines.items.dindin.hasMachine)
                    return msg.reply('**Você naõ possuí está máquina!! Digite `$shop` e compre-a!**')
                if (!member.machines.items.halita.isActive)
                    return msg.reply('**Está máquina já está desativada!! Digite `$stmchs` e saiba mais!**')
                await member.updateOne({ 'machines.items.halita.isActive': false })
                await member.updateOne({ 'machines.items.halita.timeActive': 0 })
                return msg.reply(`${emojis.switchDisable} **Máquina de Halitas desativada!!**`)
            default:
                return msg.reply('**Não foi possível desativar sua máquina!**')
        }
    }
}