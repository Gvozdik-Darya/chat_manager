const { checkDate, getEndOfSupportDate } = require("../utils/dateUtils");

function getType(row, curator) {
  const types = {
    inDepth: "Углубленный",
    mentoring: "Менторство",
  };
  const foundElements = row[0].split("\n").filter((el) => el.includes(curator));

  if (foundElements.length > 1) {
    return `${types.inDepth} ${types.mentoring}`;
  } else if (foundElements[0].includes(types.inDepth)) {
    return types.inDepth;
  } else if (foundElements[0].includes(types.mentoring)) {
    return types.mentoring;
  }
  // const result = foundElements.length > 1 ? types.inDepth : types.mentoring;
}

function getFlow(row) {
  return row[0].split("\n")[0].split(" ")[1];
}

function generateChat(row, curator) {
  const date = row[row.length - 2];
  return {
    curator,
    flow: getFlow(row),
    type: getType(row, curator),
    isActiveChat: checkDate(date),
    endOfSupportDate: getEndOfSupportDate(date),
  };
}

function myChats(data, foundColumn) {
  return foundColumn
    .map((curator) => {
      const curatorChats = data.filter((d) =>
        d.some((cell) => typeof cell === "string" && cell.includes(curator))
      );
      const chats = curatorChats.map((el) => generateChat(el, curator));
      return chats.length > 0 ? chats : undefined;
    })
    .filter((chat) => chat !== undefined);
}

module.exports = { generateChat, myChats };
