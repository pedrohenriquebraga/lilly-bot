function placeholdersBuilder(text = "", member) {
  if (!text) return false;
  const splitText = text.split(/[{}]/);
  const placeholdersData = {
    "@user": `<@${member.id}>`,
    username: member.user.username,
    userDiscriminator: member.user.discriminator,
    avatar: member.user.avatarURL({ size: 256, dynamic: true }),
    guildName: member.guild.name,
  };

  splitText.map((word) => {
    if (placeholdersData[word]) {
      splitText[splitText.indexOf(word)] = placeholdersData[word];
    }
  });

  return splitText.join("");
}

module.exports = placeholdersBuilder
