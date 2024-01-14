# Employee Timesheet Analyzer

This program analyzes employee timesheets and prints information about employees who meet specific criteria.

## Requirements
- Node.js

## Usage

1. Install dependencies:

   npm install

Run the program:


node index.js
Check the console for analyzed information.

The results are also saved in the output.txt file.

Input Data
The program reads employee timesheet data from a CSV file (data.csv).

Analysis Criteria
Employees who worked for 7 consecutive days.</br>
Employees with less than 10 hours between shifts but greater than 1 hour.</br>
Employees who worked for more than 14 hours in a single shift.</br>
File Structure</br>
index.js: Main program file.</br>
data.csv: Input data file.</br>
output.txt: Output file containing analyzed information.
