require("dotenv").config();
const xlsx = require("xlsx");
const {
  readExcel,
  convertRowsToColumns,
  findData,
} = require("./utils/excelUtils");
const { myChats } = require("./services/chatService");
const { statusChat } = require("./utils/dateUtils");

const filePath = process.env.FILE_PATH;
const curator = process.env.CURATOR;

const workbook = xlsx.readFile(filePath);
const sheetNames = workbook.SheetNames;
const schedule = sheetNames[3];
const newSchedule = sheetNames[4];
const teamLeadsAndCuratorsDayOff = sheetNames[5];

const dataFromSchedule = readExcel(workbook, schedule);
const dataFromNewSchedule = readExcel(workbook, newSchedule);
const mainData = readExcel(workbook, teamLeadsAndCuratorsDayOff);

const columnsData = convertRowsToColumns(mainData);
const foundColumn = findData(columnsData, curator);

foundColumn.shift();

const chatsFromSchedule = myChats(dataFromSchedule, foundColumn);
const chatsFromNewSchedule = myChats(dataFromNewSchedule, foundColumn);
const allChats = chatsFromSchedule.concat(chatsFromNewSchedule).flat();
const activeChats = allChats.filter(
  (chat) => chat.isActiveChat !== statusChat.closed
);

console.log(activeChats);
console.log(activeChats.length);
