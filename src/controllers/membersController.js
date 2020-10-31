const mongoose = require("mongoose");
require("../models/members");

const members = mongoose.model("Member");

module.exports = {
  async indexMember(MemberId) {
    const member = await members
      .findOne({ memberId: MemberId })
      .then(member => member)
      .catch((err) => console.error(`Erro na busca de usuário: ${err}`));

    if (!member) {
      return false;
    }

    return member;
  },

  async saveMember(member) {
    const memberObj = {
      memberId: member,
    };
    try {
      await members
        .create(memberObj)
        .catch((err) => console.log("Erro ao salvar usuário: ", err));
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
};
