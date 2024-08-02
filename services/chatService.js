const { checkDate, getEndOfSupportDate } = require("../utils/dateUtils");
const types = {
  inDepth: "Углубленный",
  mentoring: "Менторство",
};

function getType(row, curator) {
  const foundElements = row[0].split("\n").filter((el) => el.includes(curator));
  const typesArray = [];
  if (foundElements.length > 1) {
    typesArray.push(types.inDepth, types.mentoring);
  } else if (foundElements[0].includes(types.inDepth)) {
    typesArray.push(types.inDepth);
  } else if (foundElements[0].includes(types.mentoring)) {
    typesArray.push(types.mentoring);
  }
  return typesArray;
  // const result = foundElements.length > 1 ? types.inDepth : types.mentoring;
}

function getFlow(row) {
  return row[0].split("\n")[0].split(" ")[1];
}

function generateChat(row, curator, index) {
  const date = row[index];
  // console.log(row[row.length - 2]);
  const typesArray = getType(row, curator);
  const result = typesArray.map((type) => ({
    curator,
    flow: getFlow(row),
    type,
    isActiveChat: checkDate(date),
    endOfSupportDate: getEndOfSupportDate(date),
  }));
  return result;
}

function myChats(data, foundColumn, index) {
  return foundColumn
    .map((curator) => {
      const curatorChats = data.filter((d) =>
        d.some((cell) => typeof cell === "string" && cell.includes(curator))
      );
      const chats = curatorChats.flatMap((el) =>
        generateChat(el, curator, index)
      );
      return chats.length > 0 ? chats : undefined;
    })
    .filter((chat) => chat !== undefined);
}

module.exports = { generateChat, myChats, types };
