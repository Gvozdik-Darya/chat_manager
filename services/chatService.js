const { checkDate } = require("../utils/dateUtils");

function getType(row, curator) {
  const types = {
    Углубленный: "Углубленный",
    Менторство: "Менторство",
  };
  return (
    Object.keys(types).find((type) => row[0].includes(type)) || "Менторство"
  );
}

function getFlow(row) {
  return row[0].split("\n")[0].split(" ")[1];
}

function generateChat(row, curator) {
  return {
    curator,
    flow: getFlow(row),
    type: getType(row, curator),
    isActiveChat: checkDate(row[row.length - 2]),
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
