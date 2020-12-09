const mongoose = require("mongoose");
require("../models/members");

const members = mongoose.model("Member");

module.exports = {
  async hasMachine(MemberId, machine) {
    const member = await members.findOne({memberId: MemberId})
    const machines = member.machines.items
    
    return machines[machine].hasMachine
  },

  async getAllMachines(MemberId) {
    const member = await members.findOne({memberId: MemberId})
    const machines = member.machines.items
    
    if (!machines) return false
    return machines
  },

  async giveHalitaMachine(MemberId) {
    const member = await members.findOne({memberId: MemberId})

    return await member.updateOne({$set: {"machines.items.halita.hasMachine": true }})
  },

  async giveDinDinMachine(MemberId) {
    const member = await members.findOne({memberId: MemberId})

    return await member.updateOne({$set: {"machines.items.dindin.hasMachine": true }})
  },

  async selectAllActiveHalitaMachines() {
    const activeMachines = await members.find({}).where('machines.items.halita.isActive').equals(true)

    return activeMachines
  },
};
