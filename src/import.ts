import * as path from "path";
import * as fs from "fs";
import { Workbook, Worksheet } from "exceljs";
import { assign } from "./helpers";
import { separator } from "./constants";

export default function (outputPath: string, translationsPath: string): void {
    const workbook = new Workbook();

    workbook.xlsx.readFile(outputPath)
        .then((workbook: Workbook) => {
            workbook.worksheets.forEach((worksheet: Worksheet) => {
                const translations: any = {};
                let translationKeys: any[] = [];

                worksheet.columns.forEach((column: any) => {
                    const header = column.values[1];

                    if (header === "Key") {
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


                Object.entries(translations).forEach(([lang, translations]) => {
                    fs.writeFileSync(
                        path.join(translationsPath, lang, worksheet.name),
                        JSON.stringify(translations, null, "\t") + "\n"
                    );
                })
            })

        });
}

