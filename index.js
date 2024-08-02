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

    console.log("need to leave");
    console.log(leave);
    console.log("need to join");
    console.log(join);
    console.log("need to stay");
    console.log(stay);
  } catch (err) {
    console.error("Ошибка при получении групп:", err);
  }
})();

// console.log(activeChats);
// console.log(activeChats.length);
