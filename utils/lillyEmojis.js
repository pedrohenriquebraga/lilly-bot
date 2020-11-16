const Discord = require('discord.js')
const bot = new Discord.Client()

module.exports = [
    {
        lillyDinDins: bot.
            emojis
            .cache
            .find(emoji => emoji.name === "lilly_dindin") || '💵',

        lillyHalitas: bot.
            emojis
            .cache
            .find(emoji => emoji.name === "lilly_halita") || '',

        discordIcon: bot.
            emojis
            .cache
            .find(emoji => emoji.name === "lilly_discordIcon") || ''
    }
]
