const os = require('os')
const osUtils = require('os-utils')

module.exports = {
    name: 'systeminfo',
    description: 'Mostra informações do sistema da Lilly',
    args: false,
    guildOnly: true,
    economy: false,
    premium: false,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    aliases: ['stinfo'],
    usage: '$systeminfo',
    async execute(msg, args) {
        return osUtils.cpuFree(per => {
            return osUtils.harddrive((total, free, used) => {
                const mem = `${(osUtils.freemem() / 1024).toFixed(2)} GB/${((osUtils.totalmem() / 1024)).toFixed(2)} GB`
                let systemInfoEmbed = {
                    fields: [
                        { 
                            name: "<:memoria:747165492791476515> Memória RAM Livre",
                            value: `\`${mem}\``
                        },
                        { 
                            name: "CPU  Usada",
                            value: `\`${per.toFixed(2)} %\``
                        },
                        {
                            name: "<:ssd:747165573653201066> Memória Usada",
                            value: `\`${(used / 1024).toFixed(2)} GB/${(total / 1024).toFixed(2)} GB\``
                        }
                    ]
                }
                return msg.reply('', { embed: systemInfoEmbed })
            })
        })
    }
}