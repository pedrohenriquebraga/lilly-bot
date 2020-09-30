const mongoose = require('mongoose')

require('../models/guilds')

const guilds = mongoose.model('Guild')

module.exports = {
    async indexGuild(GuildId) {
        console.log('Buscando guild...')
        let guild
        await guilds.findOne({ guildId: GuildId }).then(results => {
            console.log('Busca concluída!')
            return guild = results
        })
            .catch(err => console.error('Erro ao buscar guild: ', err))

        return guild
    },
    async indexGuildPrefix(guildId) {
        console.log('Buscando prefixo...')
        const indexGuild = await guilds.findOne({ guildId: guildId })
            .then((guild) => {
                console.log('Prefixo encontrado com sucesso!!')
                return guild
            })
            .catch(err => console.error('Erro ao buscar prefixo: ', err))

        return indexGuild['guildPrefix']
    },

    async createNewGuild(guildId) {
        console.log('Criando nova guild...')
        const guild = {
            guildId: guildId
        }
        return await guilds.create(guild)
            .then(() => console.log('Guild salva com sucesso!'))
            .catch(err => console.error('Erro ao salvar guild: ', err))
    },

    async updatePrefix(guildId, newPrefix) {
        console.log('Atualizando Prefixo...')

        guilds.findOneAndUpdate({ guildId: guildId }, { guildPrefix: newPrefix })
            .catch(err => console.error('Erro ao atualizar o prefixo: ', err))
    }
}

