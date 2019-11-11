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
const helpers_1 = require("./helpers");
const constants_1 = require("./constants");
function default_1(outputPath, translationsPath) {
    const workbook = new exceljs_1.Workbook();
    workbook.xlsx.readFile(outputPath)
        .then((workbook) => {
        const worksheet = workbook.worksheets.find(w => w.name === constants_1.worksheetName) || workbook.worksheets[0];
        const translations = {};
        const filenames = worksheet.columns[0].values || [];
        const translationKeys = worksheet.columns[1].values || [];
        // iterate through columns
        // todo: probably it could be faster if iterate through rows
        worksheet.columns.forEach((column) => {
            const values = column.values || [];
            const header = values ? values[1] : "";
            if (header === constants_1.mainColumns.file.header || header === constants_1.mainColumns.key.header) {
                return;
            }
            translations[header] = translationKeys.reduce((acc, i, idx) => {
                // first row is header
                if (idx > 1) {
                    const value = values[idx] || "";
                    const path = [
                        filenames[idx],
                        ...(i.includes(constants_1.separator) ? i.split(constants_1.separator) : [i])
                    ];
                    lodash_1.set(acc, path, value);
                }
                return acc;
            }, {});
        });
        Object.entries(translations).forEach(([lang, values]) => {
            Object.entries(values).forEach(([filename, translations]) => {
                fs.writeFileSync(path.join(translationsPath, lang, filename), helpers_1.prettifyJson(translations));
            });
        });
        console.log("Completed");
    });
}
exports.default = default_1;
//# sourceMappingURL=import.js.map