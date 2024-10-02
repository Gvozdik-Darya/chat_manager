const xlsx = require("xlsx");

function readExcel(workbook, sheetName) {
  const worksheet = workbook.Sheets[sheetName];
  const rowData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const filteredData = rowData.filter((row) =>
    Object.values(row).some(
      (cell) => cell !== undefined && cell !== null && cell !== ""
    )
  );
  return filteredData;
}

function convertRowsToColumns(data) {
  let columns = Array.from({ length: data[0].length }, () => []);
  // // console.log(columns);

  data.forEach((array) => {
    array.forEach((item, i) => {
      columns[i].push(item);
    });
  });
  return columns;
}
function findData(data, searchData) {
  return data.find((d) => d.some((cell) => cell === searchData));
}
module.exports = { readExcel, convertRowsToColumns, findData };
