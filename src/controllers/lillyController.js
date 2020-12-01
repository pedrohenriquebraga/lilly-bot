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
};
