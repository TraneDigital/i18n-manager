import * as path from "path";
import * as fs from "fs";
import { Workbook, Worksheet } from "exceljs";
import { assign } from "./helpers";
import { separator, mainColumns, worksheetName } from "./constants";

export default function (outputPath: string, translationsPath: string): void {
    const workbook = new Workbook();

    workbook.xlsx.readFile(outputPath)
        .then((workbook: Workbook) => {
            const worksheet: Worksheet = workbook.worksheets.find(w => w.name === worksheetName) || workbook.worksheets[0]

            worksheet.eachRow(function(row, rowNumber) {
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


            workbook.worksheets.forEach((worksheet: Worksheet) => {

            })

        });
}

