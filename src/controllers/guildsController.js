const mongoose = require('mongoose')

require('../models/guilds')

const guilds = mongoose.model('Guild')

module.exports = {
    async indexGuild(GuildId) {
        const guild = await guilds.findOne({ guildId: GuildId })
            .then(results => results)
            .catch(err => console.error('Erro ao buscar guild: ', err))
        return guild
    },

    async createNewGuild(guildId) {
        const guild = {
            guildId: guildId
        }
        return await guilds.create(guild)
            .catch(err => console.error('Erro ao salvar guild: ', err))
    },

    async updatePrefix(guildId, newPrefix) {
        return await guilds.findOneAndUpdate({ guildId: guildId }, { guildPrefix: newPrefix })
            .catch(err => console.error('Erro ao atualizar o prefixo: ', err))
    },

    async updateDataGuild(filter = {}, update) {
        return await guilds.findOneAndUpdate(filter, update)
            .catch(err => console.error('Erro ao atualizar os dados da Guild: ', err))
    }
}

