import * as path from "path"
import * as fs from "fs"
import { Workbook, Worksheet } from "exceljs"
import { removeDuplicates } from "./helpers"
import { separator } from "./constants"

const pkg = require('../package.json')

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
function worksheetAddRow(value: any, key: string | null, worksheet: Worksheet, file: string) {
    delete value.nested;

    Object.entries(value).forEach(([nestedKey, nestedValue]: [string, any]) => {
        const newKey = key ? `${key}${separator}${nestedKey}` : nestedKey;
        if (nestedValue.nested) {
            worksheetAddRow(nestedValue, newKey, worksheet, file);
        } else {
            worksheet.addRow({
                file,
                key: newKey,
                ...nestedValue,
            });
        }
    });
}
function getAllFiles(translationsPath: string, languages: string[]): string[] {
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

    return removeDuplicates<string>(allFiles).sort()
}
function getWorksheetColumns(languages: string[]) {
    const columns = [
        { header: 'File', key: 'file', width: 30 },
        { header: 'Translation ID', key: 'key', width: 50 },
    ]

    languages.forEach(lang => {
        columns.push({ header: lang, key: lang, width: 65 });
    })

    return columns
}


export default function (outputPath: string, translationsPath: string): void {
    const languages: string[] = fs.readdirSync(translationsPath)
    const files = getAllFiles(translationsPath, languages)

    const workbook = new Workbook()
    workbook.creator = pkg.name
    workbook.lastModifiedBy = pkg.name
    workbook.created = new Date()
    workbook.modified = new Date()

    const worksheet = workbook.addWorksheet("Translations", {
        views:[{ state: 'frozen', xSplit: 1, ySplit: 1 }],
    });
    worksheet.autoFilter = 'A';
    worksheet.columns = getWorksheetColumns(languages)

    files.forEach((file: string) => {
        const langData: any = {};

        languages.forEach(lang => {
            const filePath = path.join(translationsPath, lang, file)
            const rawJsonData = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "{}";
            langData[lang] = JSON.parse(rawJsonData);
        });

        const translationData = getTranslationData(langData);
        worksheetAddRow(translationData, null, worksheet, file);
    });

    workbook.xlsx.writeFile(outputPath)
        .then(workbook => {
            // use workbook
        })
}
