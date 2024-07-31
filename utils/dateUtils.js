const statusChat = {
  active: "active",
  closed: "closed",
  lastDay: "lastDay",
};

function excelDateToJSDate(serial) {
  const excelEpoch = new Date(1899, 11, 30);
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

function checkDate(serial) {
  const date = excelDateToJSDate(serial);
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const utcTodayStart = new Date(
    Date.UTC(
      todayStart.getFullYear(),
      todayStart.getMonth(),
      todayStart.getDate()
    )
  );

  if (utcDate < utcTodayStart) {
    return statusChat.closed;
  } else if (utcDate.getTime() === utcTodayStart.getTime()) {
    return statusChat.lastDay;
  } else {
    return statusChat.active;
  }
}

module.exports = { excelDateToJSDate, checkDate, statusChat };
