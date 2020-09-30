const mongoose = require('mongoose')

require('../models/guilds')

const guilds = mongoose.model('Guild')

module.exports = {
    async indexGuild(GuildId) {
        let guild
        await guilds.findOne({ guildId: GuildId }).then(results => guild = results)
        return guild
    },

    async indexGuildPrefix(guildId) {
        const indexGuild = await guilds.findOne({ guildId: guildId })
        return indexGuild['guildPrefix']
    },

    async createNewGuild(guildId) {
        const guild = {
            guildId: guildId
        }
        return await guilds.create(guild)
    }
}

