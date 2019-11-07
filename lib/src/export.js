"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const shelljs_1 = __importDefault(require("shelljs"));
const exceljs_1 = require("exceljs");
const helpers_1 = require("./helpers");
const constants_1 = require("./constants");
function setTranslationData(translationObj, translations, lang) {
    Object.entries(translations).forEach(([langKey, trans]) => {
        translationObj[langKey] = translationObj[langKey] || {};
        if (trans && typeof trans === "object") {
            translationObj[langKey].nested = true;
            setTranslationData(translationObj[langKey], trans, lang);
        }
        else {
            translationObj[langKey] = Object.assign(Object.assign({}, translationObj[langKey]), { [lang]: trans });
        }
    });
}
function getTranslationData(data) {
    let translationData = {};
    Object.entries(data).forEach(([lang, translations]) => {
        setTranslationData(translationData, translations, lang);
    });
    return translationData;
}
function worksheetAddRow(value, key, worksheet) {
    delete value.nested;
    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        const newKey = key ? `${key}${constants_1.separator}${nestedKey}` : nestedKey;
        if (nestedValue.nested) {
            worksheetAddRow(nestedValue, newKey, worksheet);
        }
        else {
            worksheet.addRow(Object.assign({ key: newKey }, nestedValue));
        }
    });
}
function default_1(outputPath, translationsPath) {
    const workbook = new exceljs_1.Workbook();
    // todo: get creator from config or package.json
    workbook.creator = 'i18next-manager';
    workbook.created = new Date();
    const languages = fs.readdirSync(translationsPath);
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
    const files = helpers_1.removeDuplicates(allFiles).sort();
    files.forEach((file) => {
        const worksheet = workbook.addWorksheet(file, { views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }] });
        const langData = {};
        const columns = [
            { header: 'Key', key: 'key', width: 50 },
        ];
        languages.forEach(lang => {
            columns.push({ header: lang, key: lang, width: 65 });
            const filePath = path.join(translationsPath, lang, file);
            const rawJsonData = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : "{}";
            langData[lang] = JSON.parse(rawJsonData);
        });
        worksheet.columns = columns;
        const translationData = getTranslationData(langData);
        worksheetAddRow(translationData, null, worksheet);
    });
    shelljs_1.default.mkdir('-p', path.dirname(outputPath));
    workbook.xlsx.writeFile(outputPath)
        .then(workbook => {
        // use workbook
    });
}
exports.default = default_1;
//# sourceMappingURL=export.js.map