const mongoose = require('mongoose')
require('../models/members')

const members = mongoose.model('Member')

module.exports = {
    async indexMember(MemberId) {
        let member
        await members.findOne({ memberId: MemberId }).then(results => member = results)
        return member
    },

    async saveMember(member) {
        const memberObj = {
            memberId: member
        }
        
        try { await members.create(memberObj) }
        catch (error) { console.error(error) }
    }
}

