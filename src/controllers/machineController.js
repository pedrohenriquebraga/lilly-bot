const mongoose = require("mongoose");
require("../models/members");

const members = mongoose.model("Member");

module.exports = {
  async hasMachine(MemberId, machine) {
    const member = await members.findOne({memberId: MemberId})
    const machines = member.machines.items
    
    return machines[machine].hasMachine
  }
};
