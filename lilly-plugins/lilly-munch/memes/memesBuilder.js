const jimp = require("jimp");
const path = require("path");
const fs = require("fs");

function memesBuilder(msg, args, memeTemplateImg = "") {
  jimp
    .read(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "assets",
        "images",
        `${memeTemplateImg}.png`
      )
    )
    .then(async (memeTemplate) => {
      jimp
        .loadFont(jimp.FONT_SANS_32_BLACK)
        .then(async (font) => {
          let message = args.join(" ").replace("\n", " ");
          const widthText = jimp.measureText(font, message);
          const widthImage = memeTemplate.getWidth();
          const imageFormat = memeTemplate.getExtension();
          const filename = `${
            msg.author.username
          }_${Date.now()}.${imageFormat}`;
          const pathImages = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "assets",
            "images",
            "temp"
          );

          if (widthText < widthImage) {
            memeTemplate.print(font, 10, 10, message);
            memeTemplate.writeAsync(path.join(pathImages, filename));
            return msg
              .reply("", { files: [path.join(pathImages, filename)] })
              .then(() => fs.unlink(path.join(pathImages, filename), () => {}));
          } else {
            let count = 0;
            let height = 10;
            let newMessage = "";
            for (word of message.split(" ")) {
              count += 1;

              newMessage += word + " ";
              const text = jimp.measureText(font, newMessage);

              if (
                widthImage <= text ||
                count % 5 == 0 ||
                word == message.split(" ")[message.split(" ").length - 1]
              ) {
                memeTemplate.print(font, 10, height, newMessage);
                height += 30;
                newMessage = "";
              }
            }

            memeTemplate.writeAsync(path.join(pathImages, filename));
            return msg
              .reply("", { files: [path.join(pathImages, filename)] })
              .then(() => fs.unlink(path.join(pathImages, filename), () => {}));
          }
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
}

module.exports = memesBuilder;
