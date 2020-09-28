const mongoose = require('mongoose')
require('../models/members')

const members = mongoose.model('Member')

module.exports = {
    async indexMember(MemberId) {
        let member
        await members.findOne({ memberId: MemberId }).then( results => member = results )
        return member
    },

    async saveMember(member) {
        try { await members.create(member) } 
        catch (error) { console.error(error) }
    }
}

