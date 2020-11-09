const mongoose = require("mongoose");
require("../models/members");

const members = mongoose.model("Member");

module.exports = {
  async indexMember(MemberId) {
    const member = await members
      .findOne({ memberId: MemberId })
      .then((member) => member)
      .catch((err) => console.error(`Erro na busca de usuário: ${err}`));

    if (!member) {
      return await this.saveMember(MemberId);
    }

    return member;
  },

  async saveMember(member) {
    const memberObj = {
      memberId: member,
    };

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

  async addDinDins(memberId, amount) {
    const member = await this.indexMember(memberId)
    const currentMoney = member.money

    await this.updateDataMembers({ memberId: memberId, money: currentMoney + amount})
  },

  async removeDinDins(memberId, amount) {
    const member = await this.indexMember(memberId)
    const currentMoney = member.money

    await this.updateDataMembers({ memberId: memberId, money: currentMoney - amount})
  }
};
