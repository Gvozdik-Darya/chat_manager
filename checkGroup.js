const TelegramBot = require("node-telegram-bot-api");
const groupId = 1;
const userId = 1;
const TELEGRAM_BOT_TOKEN = "";
const API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const url = `${API_URL}/getChatMember?chat_id=${groupId}&user_id=${userId}`;
console.log(url);

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  polling: true,
});

bot
  .getChatMember(groupId, userId)
  .then((response) => {
    if (
      response.status === "member" ||
      response.status === "administrator" ||
      response.status === "creator"
    ) {
      console.log(`Пользователь ${userId} состоит в группе ${groupId}`);
    } else {
      console.log(`Пользователь ${userId} не состоит в группе ${groupId}`);
    }
  })
  .catch((error) => {
    console.error(`Ошибка при получении данных: ${error}`);
  });
