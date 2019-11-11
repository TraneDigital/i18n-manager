import * as path from "path"
import * as fs from "fs"
import { Workbook, Worksheet, Column } from "exceljs"
import { set } from "lodash"
import { prettifyJson } from "./helpers"
import { separator, mainColumns, worksheetName } from "./constants"
import { Translations } from "../types"

export default function (outputPath: string, translationsPath: string): void {
    const workbook = new Workbook()

    workbook.xlsx.readFile(outputPath)
        .then((workbook: Workbook) => {
            const worksheet: Worksheet = workbook.worksheets.find(w => w.name === worksheetName) || workbook.worksheets[0]

            const translations: Translations = {}
            const filenames = worksheet.columns[0].values as string[] || []
            const translationKeys = worksheet.columns[1].values as string[] || []

            // iterate through columns
            // todo: probably it could be faster if iterate through rows
            worksheet.columns.forEach((column: Partial<Column>) => {
                const values = column.values || []
                const header = values ? values[1] as string : ""

                if (header === mainColumns.file.header || header === mainColumns.key.header) {
                    return
                }

                translations[header] = translationKeys.reduce((acc, i, idx) => {
                    // first row is header
                    if (idx > 1) {
                        const value = values[idx] || ""

                        const path: string[] = [
                            filenames[idx],
                            ...(i.includes(separator) ? i.split(separator) : [i])
                        ]

                        set(acc, path, value)
                    }

                    return acc
                }, {})
            })

            Object.entries(translations).forEach(([lang, values]) => {
                Object.entries(values).forEach(([filename, translations]) => {
                    fs.writeFileSync(
                        path.join(translationsPath, lang, filename),
                        prettifyJson(translations),
                    )
                })
            })

            console.log("Completed")
        })
}

