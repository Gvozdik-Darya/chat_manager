require("dotenv").config();
const xlsx = require("xlsx");
const {
  readExcel,
  convertRowsToColumns,
  findData,
} = require("./utils/excelUtils");
const { getMyGroupTitles } = require("./findGroups");
const { myChats, types } = require("./services/chatService");
const { statusChat } = require("./utils/dateUtils");

const filePath = process.env.FILE_PATH;
const curator = process.env.CURATOR;

const workbook = xlsx.readFile(filePath);
const sheetNames = workbook.SheetNames;
const newSchedule = sheetNames[3];
const schedule = sheetNames[4];

const teamLeadsAndCuratorsDayOff = sheetNames[5];

const dataFromSchedule = readExcel(workbook, schedule);
const dataFromNewSchedule = readExcel(workbook, newSchedule);
const mainData = readExcel(workbook, teamLeadsAndCuratorsDayOff);

const columnsData = convertRowsToColumns(mainData);
const foundColumn = findData(columnsData, curator);

foundColumn.shift();

const chatsFromSchedule = myChats(dataFromSchedule, foundColumn, 9);
const chatsFromNewSchedule = myChats(dataFromNewSchedule, foundColumn, 11);
const allChats = chatsFromSchedule.concat(chatsFromNewSchedule).flat();
const activeChats = allChats.filter(
  (chat) => chat.isActiveChat !== statusChat.closed
);

const x = [
  "Чат FFA Crypto |Поток 14.4| Обучение с наставником Олегом",
  "Чат FFA Crypto |Поток 11.1| Обучение с наставником Владиславой",
  "Чат FFA Crypto |Поток 5.1| Обучение с наставником",
  "Чат FFA Crypto |Поток 6.2| Обучение с наставником Александром",
  "Чат FFA Crypto |Поток 9.4|Групповое менторство с наставником Софией",
  "Чат FFA Crypto |Поток 6.1| Обучение с наставником",
  "Чат FFA Crypto |Поток 9.5|Групповое менторство с наставником Катериной",
  "Чат FFA Crypto |Поток 9.3|Групповое менторство с наставником Никитой",
  "Чат FFA Crypto |Поток 6.1|Групповое менторство с наставником",
  "Чат FFA Crypto |Поток 4.1| Обучение с наставником",
  "Чат FFA Crypto |Поток 12.2| Обучение с наставником Никитой",
  "Чат FFA Crypto |Поток 8.2|Групповое менторство с наставником Артёмом",
  "Чат FFA Crypto |Поток 11.6|Групповое менторство с наставником Игорем",
  "Чат FFA Crypto |Поток 10.1|Групповое менторство с наставником Марией",
  "Чат FFA Crypto |Поток 14.2| Групповое менторство с наставником Борисом",
  "Чат FFA Crypto |Поток 10.2| Обучение с наставником Борисом",
  "Чат FFA Crypto |Поток 5.3|Групповое менторство с наставником",
  "Чат FFA Crypto |Поток 5.2| Обучение с наставником",
  "Чат FFA Crypto |Поток 9.2| Обучение с наставником Мариной",
  "Поток 50.1 Чат курса Крипто-профит",
  "Чат FFA Crypto |Поток 4.2|Групповое менторство с наставником",
  "Чат FFA Crypto |Поток 4.2| Обучение с наставником",
  "Чат FFA Crypto |Поток 9.1| Обучение с наставником Софией",
  "Чат FFA Crypto |Поток 3.1| Обучение с наставником",
  "Поток 49.2 Чат курса Крипто-профит",
];

(async () => {
  try {
    const groupTitles = await getMyGroupTitles();
    const result = groupTitles.map((el) => {
      const match = el.match(/Поток (\d+\.\d+)/);
      if (match) {
        let type;
        if (el.includes("Обучение с наставником")) {
          type = types.inDepth;
        } else if (el.includes("Групповое менторство ")) {
          type = types.mentoring;
        } else {
          type = "Крипто-профит";
        }
        return {
          flow: match[1].toString(),
          type: type,
        };
      }
      return null;
    });
    const stay = result.filter((groupX) =>
      activeChats.some(
        (groupY) => groupY.flow === groupX.flow && groupY.type === groupX.type
      )
    );

    const leave = result.filter(
      (groupX) =>
        !activeChats.some(
          (groupY) => groupY.flow === groupX.flow && groupY.type === groupX.type
        )
    );

    const join = activeChats.filter(
      (groupY) =>
        !result.some(
          (groupX) => groupX.flow === groupY.flow && groupX.type === groupY.type
        )
    );
    console.log("need to stay");
    console.log(stay);
    console.log("need to leave");
    console.log(leave);
    console.log("need to join");
    console.log(join);
  } catch (err) {
    console.error("Ошибка при получении групп:", err);
  }
})();

// console.log(activeChats);
// console.log(activeChats.length);
