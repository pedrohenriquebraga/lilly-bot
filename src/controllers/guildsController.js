const mongoose = require('mongoose')
require('../models/guilds')

const guilds = mongoose.model('Guild')

module.exports = {
    async indexMember(GuildId) {
        let guild
        await guilds.findOne({ guildId: GuildId }).then( results => guild = results )
        return guild
    }
}

