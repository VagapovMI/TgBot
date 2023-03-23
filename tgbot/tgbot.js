require('dotenv').config();
const tg = require(`node-telegram-bot-api`)
const token = process.env.TOKEN
const bot = new tg(token, {polling: true})
bot.on(`message`, msg => {
    console.log(msg)
    const text = msg.text
    const chatId = msg.chat.id;

    if (text === `/start`) {
        bot.sendMessage(chatId, `Чтобы получить ссылку на скачивание файла данных: напишите Ссылка, если нужен непосредственно файл: Файл.`)
    if (text === ``)
        bot.sendMessage(chatId, `https://s3.timeweb.com/cd58536-mhand-bucket/cards/cards.csv`)
        else { неверный }
    }

    if (text === `Ссылка`) {
        bot.sendMessage(chatId, `https://s3.timeweb.com/cd58536-mhand-bucket/cards/cards.csv`)
    }
        if (text === `Файл`) {
                bot.sendDocument(chatId, `C:\\Users\\spt\\WebstormProjects\\testTask\\cards.csv`)
        }
    })
