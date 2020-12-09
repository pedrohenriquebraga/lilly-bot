function placeholdersBuilder(text = "", member) {
  if (!text) return false;
  const splitText = text.split(/[{}]/);
  const placeholdersData = {
    "@user": `<@${member.id}>`,
    username: member.user.username,
    userNick: member.nickname,
    userDiscriminator: member.user.discriminator,
    userId: member.id,
    avatar: member.user.avatarURL({ size: 256, dynamic: true }),
    guildName: member.guild.name,
    guildCount: member.guild.memberCount,
  };

  splitText.map((word) => {
    if (placeholdersData[word]) {
      splitText[splitText.indexOf(word)] = placeholdersData[word];
    }
  });

  return splitText.join("");
}

module.exports = placeholdersBuilder
