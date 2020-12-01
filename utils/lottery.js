async function startLottery(bot) {
    const date = new Date()
    if (date.getHours() != 12 || date.getHours() != 0) return

    const members = require("../src/controllers/membersController")
    const getAllParticipants = await members.getAllParticipantsLottery()

    if (!getAllParticipants) return

    for (participant of getAllParticipants) {
        
    }

}