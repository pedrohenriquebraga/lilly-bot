const jimp = require("jimp");
const path = require("path");

module.exports = {
  name: "stonks",
  description: "Crie seu meme stonks!!",
  args: true,
  guildOnly: true,
  economy: false,
  premium: false,
  fun: true,
  userPermissions: "Nenhuma",
  lillyPermissions: "Nenhuma",
  aliases: [],
  usage: "$stonks (frase)",
  async execute(msg, args) {
    jimp
      .read(
        path.join(__dirname, "..", "..", "..", "assets", "images", "stonks.png")
      )
      .then(async (stonks) => {
        jimp
          .loadFont(jimp.FONT_SANS_32_BLACK)
          .then(async (font) => {
            let message = args.join(' ');
            const widthText = jimp.measureText(font, message);
            const widthImage = stonks.getWidth();

            if (widthText < widthImage) {
              stonks.print(font, 10, 10, message);
              stonks.writeAsync(
                path.join(
                  __dirname,
                  "..",
                  "..",
                  "..",
                  "assets",
                  "images",
                  "oi.png"
                )
              );
              return msg.reply("", {
                files: [
                  path.join(
                    __dirname,
                    "..",
                    "..",
                    "..",
                    "assets",
                    "images",
                    "oi.png"
                  ),
                ],
              });
            } else {
              let count = 0;
              let height = 10;
              let newMessage = "";
              for (word of message.split(' ')) {
                count += 1;

                newMessage += word + " ";
                const text = jimp.measureText(font, newMessage);

                if (
                  widthImage <= text ||
                  count % 5 == 0 ||
                  word == message.split(' ')[message.split(' ').length - 1]
                ) {
                  stonks.print(font, 10, height, newMessage);
                  height += 30;
                  // count = 0
                  newMessage = "";
                }
              }

              stonks.writeAsync(
                path.join(
                  __dirname,
                  "..",
                  "..",
                  "..",
                  "assets",
                  "images",
                  "oi.png"
                )
              );
              return msg.reply("", {
                files: [
                  path.join(
                    __dirname,
                    "..",
                    "..",
                    "..",
                    "assets",
                    "images",
                    "oi.png"
                  ),
                ],
              });
            }
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  },
};
