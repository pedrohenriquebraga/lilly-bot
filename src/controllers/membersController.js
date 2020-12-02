const mongoose = require("mongoose");
const { converterNumber } = require("../../utils/numberConverter")
require("../models/members");

const members = mongoose.model("Member");

module.exports = {
  async indexMember(MemberId) {
    const member = await members
      .findOne({ memberId: MemberId })
      .then((member) => member)
      .catch((err) => console.error(`Erro na busca de usuário: ${err}`))
    return member;
  },

  async saveMember(member) {
    const memberObj = {
      memberId: member,
    };

    if (await this.indexMember(member)) return
    let createdMember;

    try {
      await members
        .create(memberObj)
        .then((member) => (createdMember = member))
        .catch((err) => console.log("Erro ao salvar usuário: ", err));
      return createdMember;
    } catch (error) {
      console.error("Não foi possível salvar o usuário: ", error);
    }
  },

  async updateDataMembers(filter, update) {
    await members
      .findOneAndUpdate(filter, update)
      .catch((err) =>
        console.error("Erro ao atualizar os dados do Usuário: ", err)
      );
  },

  async getDinDinsTop(limit = 10) {
    const moneyTops = await members.find({}).limit(limit).sort({ money: -1 });
    if (moneyTops) return moneyTops;
    return false;
  },

  async getTotalDinDins() {
    let totalMoney = 0;
    await (await members.find({}).where("money").gt(0)).map(
      (user) => (totalMoney += user.money)
    );

    return totalMoney;
  },

  async countRegisterMembers() {
    return await members.find({}).estimatedDocumentCount(number => number)
  },

  async getAllParticipantsLottery() {
    return await members.find({}).where('lottery.isParticipating').equals(true)
  },

  async addDinDins(memberId, amount = 0) {
    const member = await this.indexMember(memberId)
    const currentMoney = Math.floor(member.money + amount)

    await this.updateDataMembers({ memberId: memberId}, { money: currentMoney })
  },

  async addHalitas(memberId, amount) {
    const member = await this.indexMember(memberId)
    const currentSpecialMoney = Number(member.specialMoney + amount).toFixed(3)

    await this.updateDataMembers({ memberId: memberId}, { specialMoney: currentSpecialMoney })
  },

  async removeDinDins(memberId, amount = 0) {
    const member = await this.indexMember(memberId)
    const currentMoney = member.money

    await this.updateDataMembers({ memberId: memberId}, { money: currentMoney - amount })
  },

  async removeHalitas(memberId, amount = 0) {
    const member = await this.indexMember(memberId)
    const currentHalitas = member.specialMoney - amount

    await this.updateDataMembers({ memberId: memberId}, {specialMoney: currentHalitas})
  },

  async finishLottery(memberId, award) {
    const member = await this.indexMember(memberId)

    return await member.updateOne({
      'lottery.isParticipating': false,
      'lottery.selectNumbers': [],
      'lottery.betAmount': 0,
      money: member.money + award
    })
  }
};
