import * as path from "path";
import * as fs from "fs";
import shelljs from "shelljs";
import { Workbook, Worksheet } from "exceljs";
import { removeDuplicates } from "./helpers";
import { separator } from "./constants";


function setTranslationData(translationObj: any, translations: any, lang: string): void {
    Object.entries(translations).forEach(([langKey, trans]) => {
        translationObj[langKey] = translationObj[langKey] || {};

        if (trans && typeof trans === "object") {
            translationObj[langKey].nested = true;
            setTranslationData(translationObj[langKey], trans, lang)
        } else {
            translationObj[langKey] = {
                ...translationObj[langKey],
                [lang]: trans,
            }
        }
    })
}
function getTranslationData(data: any): any {
    let translationData = {};

    Object.entries(data).forEach(([lang, translations]) => {
        setTranslationData(translationData, translations, lang);
    });

    return translationData;
}
function worksheetAddRow(value: any, key: string | null, worksheet: Worksheet) {
    delete value.nested;

    Object.entries(value).forEach(([nestedKey, nestedValue]: [string, any]) => {
        const newKey = key ? `${key}${separator}${nestedKey}` : nestedKey;
        if (nestedValue.nested) {
            worksheetAddRow(nestedValue, newKey, worksheet);
        } else {
            worksheet.addRow({
                key: newKey,
                ...nestedValue,
            });
        }
    });
}


export default function (outputPath: string, translationsPath: string): void {
    const workbook = new Workbook()
    // todo: get creator from config or package.json
    workbook.creator = 'i18next-manager'
    workbook.created = new Date()

    const languages: string[] = fs.readdirSync(translationsPath)

    const allFiles = languages.reduce((acc: string[], lang: string) => {
        const filePath = path.join(translationsPath, lang)

        if (!fs.existsSync(filePath)) {
            return acc
        }

        return [
            ...acc,
            ...fs.readdirSync(filePath),
        ]
    }, [])
    const files = removeDuplicates<string>(allFiles).sort()


    files.forEach((file: string) => {
        const worksheet = workbook.addWorksheet(file, {views:[{state: 'frozen', xSplit: 1, ySplit: 1}]});
        const langData: any = {};

        const columns = [
            { header: 'Key', key: 'key', width: 50 },
        ];

        languages.forEach(lang => {
            columns.push({ header: lang, key: lang, width: 65 });

            const filePath = path.join(translationsPath, lang, file)
            const rawJsonData = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : "{}";
            langData[lang] = JSON.parse(rawJsonData);
        });

        worksheet.columns = columns;

        const translationData = getTranslationData(langData);

        worksheetAddRow(translationData, null, worksheet);
    });

    shelljs.mkdir('-p', path.dirname(outputPath))
    workbook.xlsx.writeFile(outputPath)
        .then(workbook => {
            // use workbook
        })
}
