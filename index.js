const fs = require("fs");
const readline = require("readline");
const parseTime = (timeStr) => new Date(timeStr);

const analyzeTimesheet = (data) => {
  const employees = {};
  const output = [];

  data.forEach((row) => {
    const positionId = row["Position ID"];
    const employeeName = row["Employee Name"];
    const timeIn = parseTime(row["Time"]);
    const timeOut = parseTime(row["Time Out"]);

    if (!employees[employeeName]) {
      employees[employeeName] = { consecutiveDays: 1, lastTimeOut: timeOut };
    } else {
      if (
        (timeIn - employees[employeeName].lastTimeOut) /
          (1000 * 60 * 60 * 24) ===
        1
      ) {
        employees[employeeName].consecutiveDays += 1;
      } else {
        employees[employeeName].consecutiveDays = 1;
      }
      employees[employeeName].lastTimeOut = timeOut;
    }

    if (employees[employeeName].lastTimeOut) {
      const timeBetweenShifts =
        (timeIn - employees[employeeName].lastTimeOut) / (1000 * 60 * 60);
      if (1 < timeBetweenShifts && timeBetweenShifts < 10) {
        const message = `${employeeName} has less than 10 hours between shifts (but greater than 1 hour).`;
        output.push(message);
        console.log(message);
        fs.appendFileSync("output.txt", message + "\n");
      }
    }

    if ((timeOut - timeIn) / (1000 * 60 * 60) > 14) {
      const message = `${employeeName} worked for more than 14 hours in a single shift.`;
      output.push(message);
      console.log(message);
      fs.appendFileSync("output.txt", message + "\n");
    }

    if (employees[employeeName].consecutiveDays === 7) {
      const message = `${employeeName} has worked for 7 consecutive days. Position: ${positionId}`;
      output.push(message);
      console.log(message);
      fs.appendFileSync("output.txt", message + "\n");
    }
  });

  console.log("Output written to output.txt");
};

const inputFile = "data.csv";
const stream = readline.createInterface({
  input: fs.createReadStream(inputFile),
  output: process.stdout,
  terminal: false,
});

let headers = [];
let isFirstLine = true;

stream
  .on("line", (line) => {
    const values = line.split("\t").map((value) => value.trim());
    if (isFirstLine) {
      headers = values;
      isFirstLine = false;
    } else {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      analyzeTimesheet([row]);
    }
  })
  .on("close", () => {
    console.log("File reading completed.");
  });
