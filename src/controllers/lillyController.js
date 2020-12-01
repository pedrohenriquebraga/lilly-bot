const mongoose = require("mongoose");
require("../models/lilly");

const lilly = mongoose.model("Lilly");

module.exports = {
  async saveLillyUser() {
    return lilly.create({ selectLilly: 'lilly'})
  },

  async getLilly() {
    let lillyUser = await lilly.findOne({ selectLilly: 'lilly'})
    if (!lillyUser) lillyUser = await this.saveLillyUser()

    return lillyUser
  },
  async getLotteryStats() {
    const lilly = await this.getLilly()
    return lilly['lottery']
  },

  async addNewParticipants(betAmount) {
    const lilly = await this.getLilly()
    if (isNaN(lilly.lottery.currentAward)) lilly.lottery.currentAward = 0
    if (isNaN(lilly.lottery.participants)) lilly.lottery.participants = 0
  
    const currentAward = lilly.lottery.currentAward + betAmount
    const participants = lilly.lottery.participants + 1

    return await lilly.update({ 'lottery.currentAward': currentAward, 'lottery.participants': participants })
  }
};
