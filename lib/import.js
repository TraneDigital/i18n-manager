"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceljs_1 = require("exceljs");
const constants_1 = require("./constants");
function default_1(outputPath, translationsPath) {
    const workbook = new exceljs_1.Workbook();
    workbook.xlsx.readFile(outputPath)
        .then((workbook) => {
        const worksheet = workbook.worksheets.find(w => w.name === constants_1.worksheetName) || workbook.worksheets[0];
        worksheet.eachRow(function (row, rowNumber) {
            console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
        });
        /*const translations: any = {};
        let translationKeys: any[] = [];

        worksheet.columns.forEach((column: any) => {
            const header = column.values[1];

            if (header === mainColumns.file.header) {

            } else if (header === mainColumns.key.header) {
                translationKeys = column.values
            } else {
                translations[header] = translationKeys.reduce((acc, i, idx) => {
                    if (idx < 2) {
                        return acc;
                    }

                    column.values = column.values || {};

                    const value = column.values[idx] || "";

                    if (i.includes(separator)) {
                        const keys = i.split(separator);
                        assign(acc, keys, value);
                        return acc;
                    }

                    return {
                        ...acc,
                        [i]: value,
                    }
                }, {})
            }
        });

        console.log(translations);*/
        /*Object.entries(translations).forEach(([lang, translations]) => {
            fs.writeFileSync(
                path.join(translationsPath, lang, worksheet.name),
                JSON.stringify(translations, null, "\t") + "\n"
            );
        })*/
        workbook.worksheets.forEach((worksheet) => {
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=import.js.map