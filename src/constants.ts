import { Style } from "exceljs"

export const separator = "::"

export const worksheetName = "Translations"

export const mainColumns = {
    file: { header: "File", key: "file" },
    key: { header: "Translation ID", key: "key" },
}

export const defaultColumnStyles: {style: Partial<Style>} = {
    style: {
        alignment: {
            indent: 1,
            vertical: "top",
            horizontal: "left",
        },
        border: {
            left: { style: "medium" },
            right: { style: "medium" },
        }
    }
}
