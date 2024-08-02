const input = require("input");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
require("dotenv").config();

const api_id = process.env.API_ID;
const api_hash = process.env.API_HASH;
const phone = process.env.MY_NUMBER;
const session = process.env.SESSION;

const stringSession = new StringSession(session);
async function getMyGroupTitles() {
  const client = new TelegramClient(stringSession, api_id, api_hash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => phone,
    password: async () => await input.text("Введите пароль: "),
    phoneCode: async () =>
      await input.text("Введите код, полученный в Telegram: "),
    onError: (err) => console.log(err),
  });

  //   console.log("Вы успешно вошли в систему.");

  const result = await client.getDialogs({
    archived: false,
    isGroup: true,
  });
  const groupTitles = result
    .map((chat) => chat.title)
    .filter((el) => el.includes("Поток"));

  await client.disconnect();
  return groupTitles;
}
module.exports = {
  getMyGroupTitles,
};
