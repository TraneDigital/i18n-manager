import * as path from "path"
import * as fs from "fs"
import { Workbook, Worksheet, Cell, Column } from "exceljs"
import { uniq } from "lodash"
import { separator, mainColumns, worksheetName } from "./constants"
import { Translations, Translation } from "../types"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json')

function setTranslationData(translationObj: Translations, translations: Translations | Translation, lang: string): void {
    Object.entries(translations).forEach(([langKey, trans]) => {
        translationObj[langKey] = translationObj[langKey] || {}

        if (trans && typeof trans === "object") {
            // todo: get rid of nested: boolean property
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            translationObj[langKey].nested = true
            setTranslationData(translationObj[langKey] as Translations, trans, lang)
        } else {
            translationObj[langKey] = {
                ...translationObj[langKey],
                [lang]: trans,
            }
        }
    })
}
function getTranslationData(data: Translations): Translations {
    const translationData: Translations = {}

    Object.entries(data).forEach(([lang, translations]) => {
        setTranslationData(translationData, translations, lang)
    })

    return translationData
}
function worksheetAddRow(value: Translations | Translation, key: string | null, worksheet: Worksheet, file: string): void {
    delete value.nested

    Object.entries(value).forEach(([nestedKey, nestedValue]: [string, Translation]) => {
        const newKey = key ? `${key}${separator}${nestedKey}` : nestedKey
        if (nestedValue.nested) {
            worksheetAddRow(nestedValue, newKey, worksheet, file)
        } else {
            worksheet.addRow({
                file,
                key: newKey,
                ...nestedValue,
            })
        }
    })
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

    return uniq(allFiles).sort()
}
function getWorksheetColumns(languages: string[]): Partial<Column>[] {
    const columns = [
        { ...mainColumns.file, width: 19 },
        { ...mainColumns.key, width: 50 },
    ]

    languages.forEach(lang => {
        columns.push({ header: lang, key: lang, width: 65 })
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

    const worksheet = workbook.addWorksheet(worksheetName, {
        views:[{ state: 'frozen', xSplit: 2, ySplit: 1 }],
    })
    worksheet.autoFilter = 'A'
    worksheet.columns = getWorksheetColumns(languages)

    files.forEach((file: string) => {
        const langData: Translations = {}

        languages.forEach(lang => {
            const filePath = path.join(translationsPath, lang, file)
            const rawJsonData = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "{}"
            langData[lang] = JSON.parse(rawJsonData)
        })

        const translationData = getTranslationData(langData)
        worksheetAddRow(translationData, null, worksheet, file)
    })

    // Add text wrap to cells
    languages.forEach((lang: string) => {
        worksheet.getColumn(lang).eachCell((cell: Cell) => {
            cell.alignment = {
                wrapText: true,
                vertical: "top",
                horizontal: "left",
            }
        })
    })

    // Make table header text bold
    const headRow = worksheet.getRow(1)
    headRow.height = 19
    headRow.eachCell((cell: Cell) => {
        cell.font = {
            bold: true,
        }
        cell.alignment = {
            vertical: "middle",
            horizontal: "center",
        }
    })

    workbook.xlsx.writeFile(outputPath)
        .then(() => console.log("Completed"))
}
