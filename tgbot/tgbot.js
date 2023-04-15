require('dotenv').config();
const tg = require(`node-telegram-bot-api`)
const token = process.env.TOKEN
const bot = new tg(token, {polling: true})
let fs = require(`fs`)
const csv = require(`csv-parser`);
    bot.on(`message`, async (msg) => {
        console.log(msg)
        const text = msg.text
        const chatId = msg.chat.id;
        if (text === `/start`) {
            await bot.sendMessage(chatId, `Чтобы получить ссылку на скачивание файла базы клиентов: напишите Ссылка, если хотите получить файл для выгрузки базы в Set - пришлите мне файл.`)
        }
        if (text === `Ссылка`) {
            await bot.sendMessage(chatId, `Введите пароль:`)
        }
        if (text === process.env.PASS) {
            await bot.sendMessage(chatId, process.env.FILE_LINK)
        }
        if (text === "Записать") {
            try {
                let arr = [];
                fs.createReadStream(`mh.csv`)
                    .pipe(csv())
                    .on(`data`, (data) => arr.push(data))
                    .on(`end`, () => {
                        console.log(arr);
                        let text = ''
                        for (let i = 0; i < arr.length; i++) {
                            text += '<good marking-of-the-good="' + arr[i].s + '">\n' +
                                '    <product-type>ProductPieceEntity</product-type>\n' +
                                '    <name>' + arr[i].t + '</name>\n' +
                                '    <vat>20</vat>\n' +
                                '    <manufacturer id="643">\n' +
                                '      <name>РОССИЯ</name>\n' +
                                '    </manufacturer>\n' +
                                '    <bar-code code="' + arr[i].s + '">\n' +
                                '      <count>1</count>\n' +
                                '    </bar-code>\n' +
                                '    <price-entry price="' + arr[i].c + '" deleted="false">\n' +
                                '      <number>1</number>\n' +
                                '      <department number="1">\n' +
                                '        <name>1</name>\n' +
                                '      </department>\n' +
                                '    </price-entry>\n' +
                                '    <measure-type id="шт.">\n' +
                                '      <name>шт.</name>\n' +
                                '    </measure-type>\n' +
                                '    <group id="second">\n' +
                                '      <name>"second"</name>\n' +
                                '     </group>\n' +
                                '      <plugin-property key="precision" value="1"/>\n' +
                                '  </good>\n';
                        }
                        fs.writeFile(process.env.UPL_DIR,
                            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
                            '<goods-catalog>\n' + text + '</goods-catalog>',
                            function () {
                            });
                    })
            }catch (e){
                console.log(e)
            }
        }
        if (text === "Скачать") {
            bot.sendDocument(chatId, process.env.UPL_DIR)
            fs.unlink("mh.csv", function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Файл Удален");
                }
            });
        }
    })
    bot.on('document', function (msg) {
        console.log(msg);
        bot.downloadFile(msg.document.file_id, process.env.DOWN_DIR).then(function (filePath) {
            var absoluteFile = process.env.DOWN_DIR + '/' + msg.document.file_name;
            fs.rename(filePath, absoluteFile, function () {
               console.log('Файл скачан')
            });
        });
    });