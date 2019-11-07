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
const helpers_1 = require("./helpers");
const constants_1 = require("./constants");
function default_1(outputPath, translationsPath) {
    const workbook = new exceljs_1.Workbook();
    if (!fs.existsSync(outputPath)) {
        helpers_1.throwError("Wrong path to output excel file");
    }
    workbook.xlsx.readFile(outputPath)
        .then((workbook) => {
        workbook.worksheets.forEach((worksheet) => {
            const translations = {};
            let translationKeys = [];
            worksheet.columns.forEach((column) => {
                const header = column.values[1];
                if (header === "Key") {
                    translationKeys = column.values;
                }
                else {
                    translations[header] = translationKeys.reduce((acc, i, idx) => {
                        if (idx < 2) {
                            return acc;
                        }
                        column.values = column.values || {};
                        const value = column.values[idx] || "";
                        if (i.includes(constants_1.separator)) {
                            const keys = i.split(constants_1.separator);
                            helpers_1.assign(acc, keys, value);
                            return acc;
                        }
                        return Object.assign(Object.assign({}, acc), { [i]: value });
                    }, {});
                }
            });
            Object.entries(translations).forEach(([lang, translations]) => {
                fs.writeFileSync(path.join(translationsPath, lang, worksheet.name), JSON.stringify(translations, null, "\t") + "\n");
            });
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=import.js.map