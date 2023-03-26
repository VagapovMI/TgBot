require('dotenv').config();
const tg = require(`node-telegram-bot-api`)
const token = process.env.TOKEN
const bot = new tg(token, {polling: true})
let fs = require(`fs`)
bot.on(`message`, msg => {
    console.log(msg)
    const text = msg.text
    const chatId = msg.chat.id;

    if (text === `/start`) {
        bot.sendMessage(chatId, `Чтобы получить ссылку на скачивание файла данных: напишите Ссылка`)
    }
    if (text === `Ссылка`) {
        bot.sendMessage(chatId, `Введите пароль:`)
    }
        if (text === `777`) {
                bot.sendMessage(chatId, process.env.FILE_LINK)
        }
    if (text === "Записать") {
        fs.writeFile(process.env.UPL_DIR,
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<goods-catalog>
<good marking-of-the-good="` + "code" + `">
    <product-type>ProductPieceEntity</product-type>
    <name>` + "name" + `</name>
    <vat>20</vat>
    <manufacturer id="643">
      <name>РОССИЯ</name>
    </manufacturer>
    <bar-code code="` + "code" + `">
      <count>1</count>
    </bar-code>
    <price-entry price="` + "price" + `" deleted="false">
      <number>1</number>
      <department number="1">
        <name>1</name>
      </department>
    </price-entry>
    <measure-type id="шт.">
      <name>шт.</name>
    </measure-type>
    <group id="second">
      <name>second</name>
     </group>
      <plugin-property key="precision" value="1"/>
  </good>
  </goods-catalog>`,
            function () {
                console.log(`Done`);
            });
    }

    if (text === "Скачать") {
        bot.sendDocument(chatId, process.env.UPL_DIR)
    }
})
bot.on('document', function (msg) {
    console.log(msg);
    bot.downloadFile(msg.document.file_id, process.env.DOWN_DIR).then(function (filePath) {
        var absoluteFile = process.env.DOWN_DIR + '/' + msg.document.file_name;
        fs.rename(filePath, absoluteFile, function () {
            console.log('Файл скачан');
        });
    });
});