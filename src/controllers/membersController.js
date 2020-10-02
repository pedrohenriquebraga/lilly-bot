const mongoose = require('mongoose')
require('../models/members')

const members = mongoose.model('Member')

module.exports = {
    async indexMember(MemberId) {
        let member
        console.log('Buscando usuário...')
        await members.findOne({ memberId: MemberId }).then(results => {
            console.log('Busca concluída!')

            return member = results
        })
            .catch(err => console.error(`Erro na busca de usuário: ${err}`))

        return member
    },

    async saveMember(member) {
        const memberObj = {
            memberId: member
        }
        try {
            console.log('Criando usuário...')

            if (!existMember) {
                await members.create(memberObj)
                    .then(() => console.log('Usuário criado com sucesso!!'))
                    .catch(err => console.log('Erro ao salvar usuário: ', err))
            }

        } catch (error) { console.error('Não foi possível salvar o usuário: ', error) }
    },

    async updateDataMembers(filter, update) {
        console.log('Atualizando Dados Do Usuário...')

        await members.findOneAndUpdate(filter, update)
            .catch(err => console.error('Erro ao atualizar os dados do Usuário: ', err))
    }
}

