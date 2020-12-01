const mongoose = require("mongoose");
require("../models/lilly");

const lilly = mongoose.model("Member");
const lillyUser = lilly.find({ selectLilly: 'lilly' })

module.exports = {
  
};
