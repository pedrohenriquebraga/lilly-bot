const members = require("../../controllers/membersController");
const emojis = require("../../../emojis.json")

module.exports = {
    name: 'activate',
    description: 'Ativa máquinas',
    args: true,
    guildOnly: true,
    economy: true,
    premium: false,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    aliases: ['ativar'],
    usage: '$activate (máquina)',
    async execute(msg, args) {
        if (!args)
            return msg.reply('**Informe a máquina a ser ativada!!**')

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
                if (member.machines.items.dindin.isActive)
                    return msg.reply('**Está máquina já está ativa!! Digite `$stmchs` e saiba mais!**')
                await member.updateOne({ 'machines.items.dindin.isActive': true })
                await member.updateOne({ 'machines.items.dindin.timeActive': 12 })
                return msg.reply(`${emojis.switchEnable} **Máquina de DinDins ativada!!**`)
            case 'halita':
                if (!member.machines.items.halita.hasMachine)
                    return msg.reply('**Você naõ possuí está máquina!! Digite `$shop` e compre-a!**')
                if (member.machines.items.dindin.isActive)
                    return msg.reply('**Está máquina já está ativa!! Digite `$stmchs` e saiba mais!**')
                await member.updateOne({ 'machines.items.halita.isActive': true })
                await member.updateOne({ 'machines.items.halita.timeActive': 12 })
                return msg.reply(`${emojis.switchEnable} **Máquina de Halitas ativada!!**`)
            default:
                return msg.reply('**Não foi possível ativar sua máquina!**')
        }
    }
}