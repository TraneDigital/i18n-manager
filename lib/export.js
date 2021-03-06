"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const exceljs_1 = require("exceljs");
const lodash_1 = require("lodash");
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
function setTranslationData(translationObj, translations, lang) {
    Object.entries(translations).forEach(([langKey, trans]) => {
        translationObj[langKey] = translationObj[langKey] || {};
        if (trans && typeof trans === "object") {
            // todo: get rid of nested: boolean property
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            translationObj[langKey].nested = true;
            setTranslationData(translationObj[langKey], trans, lang);
        }
        else {
            translationObj[langKey] = Object.assign(Object.assign({}, translationObj[langKey]), { [lang]: trans });
        }
    });
}
function getTranslationData(data) {
    const translationData = {};
    Object.entries(data).forEach(([lang, translations]) => {
        setTranslationData(translationData, translations, lang);
    });
    return translationData;
}
function worksheetAddRow(value, key, worksheet, file) {
    delete value.nested;
    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        const newKey = key ? `${key}${constants_1.separator}${nestedKey}` : nestedKey;
        if (nestedValue.nested) {
            worksheetAddRow(nestedValue, newKey, worksheet, file);
        }
        else {
            worksheet.addRow(Object.assign({ file, key: newKey }, nestedValue));
        }
    });
}
function getAllFiles(translationsPath, languages) {
    const allFiles = languages.reduce((acc, lang) => {
        const filePath = path.join(translationsPath, lang);
        if (!fs.existsSync(filePath)) {
            return acc;
        }
        return [
            ...acc,
            ...fs.readdirSync(filePath),
        ];
    }, []);
    return lodash_1.uniq(allFiles).sort();
}
function getWorksheetColumns(languages) {
    const columns = [
        Object.assign(Object.assign(Object.assign({}, constants_1.mainColumns.file), constants_1.defaultColumnStyles), { width: 19 }),
        Object.assign(Object.assign(Object.assign({}, constants_1.mainColumns.key), constants_1.defaultColumnStyles), { width: 50 }),
    ];
    languages.forEach(lang => {
        columns.push(Object.assign(Object.assign({ header: lang, key: lang }, constants_1.defaultColumnStyles), { width: 65 }));
    });
    return columns;
}
function default_1(outputPath, translationsPath) {
    const languages = fs.readdirSync(translationsPath);
    const files = getAllFiles(translationsPath, languages);
    const author = helpers_1.getAuthor();
    const workbook = new exceljs_1.Workbook();
    workbook.creator = author;
    workbook.lastModifiedBy = author;
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet(constants_1.worksheetName, {
        views: [{
                state: 'frozen',
                xSplit: 2,
                ySplit: 1,
            }],
    });
    worksheet.autoFilter = 'A';
    worksheet.columns = getWorksheetColumns(languages);
    files.forEach((file) => {
        const langData = {};
        languages.forEach(lang => {
            const filePath = path.join(translationsPath, lang, file);
            const rawJsonData = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "{}";
            langData[lang] = JSON.parse(rawJsonData);
        });
        const translationData = getTranslationData(langData);
        worksheetAddRow(translationData, null, worksheet, file);
    });
    // Add text wrap to cells
    languages.forEach((lang) => {
        const column = worksheet.getColumn(lang);
        column.alignment = Object.assign(Object.assign({}, column.alignment), { wrapText: true });
    });
    // Make table header text bold
    const headRow = worksheet.getRow(1);
    headRow.height = 19;
    headRow.font = Object.assign(Object.assign({}, headRow.font), { bold: true });
    headRow.alignment = Object.assign(Object.assign({}, headRow.alignment), { wrapText: false, vertical: "middle", horizontal: "center" });
    workbook.xlsx.writeFile(outputPath)
        .then(() => console.log("Completed"));
}
exports.default = default_1;
//# sourceMappingURL=export.js.map