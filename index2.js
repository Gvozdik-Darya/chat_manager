const xlsx = require("xlsx");

function readExcelFile(filePath, channelColumn, numberColumn, searchValue) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = "Чаты";
    const worksheet = workbook.Sheets[sheetName];

    // Преобразование рабочей страницы в массив объектов JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      raw: true,
      cellText: true,
    });

    // Проверка наличия данных
    if (jsonData.length === 0) {
      console.error("Лист пуст или содержит только заголовок.");
      return null;
    }

    // Функция для преобразования значений в столбце "№"
    const transformValue = (value) => {
      if (typeof value === "number") {
        const date = new Date(Math.round((value - 25569) * 86400 * 1000)); // Преобразование числа в дату
        // console.log(date);
        const month = date.getUTCMonth() + 1; // Месяцы в JavaScript начинаются с 0
        const day = date.getUTCDate();
        return `${day}.${month}`;
      }
      return value ? value.toString() : "";
    };

    // Преобразуем значения в столбце "№"
    const transformedData = jsonData.map((row) => {
      const newRow = { ...row };
      newRow[numberColumn] = transformValue(row[numberColumn]);
      return newRow;
    });

    // Фильтрация строк, содержащих искомое значение в столбце "№"
    const filteredData = transformedData.filter(
      (row) => row[numberColumn] === searchValue
    );
    const results = filteredData.map((row) => row[channelColumn]);

    console.log("Найденные данные:", results);
    return results;
  } catch (error) {
    console.error(`Произошла ошибка при чтении файла: ${error.message}`);
    return null;
  }
}

const filePath = "students.xlsx";
const channelColumn = "Пакет Углубленный  +/- 80 человек"; // Название столбца с ссылками
const numberColumn = "№"; // Название столбца с номерами
const searchValue = "6.1"; // Искомое значение в столбце "№"
const data = readExcelFile(filePath, channelColumn, numberColumn, searchValue);
if (data) {
  console.log(data); // Печать найденных данных
}
