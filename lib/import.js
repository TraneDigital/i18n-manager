"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var exceljs_1 = require("exceljs");
var helpers_1 = require("./helpers");
var constants_1 = require("./constants");
function default_1(outputPath, translationsPath) {
    var workbook = new exceljs_1.Workbook();
    workbook.xlsx.readFile(outputPath)
        .then(function (workbook) {
        workbook.worksheets.forEach(function (worksheet) {
            var translations = {};
            var translationKeys = [];
            worksheet.columns.forEach(function (column) {
                var header = column.values[1];
                if (header === "Key") {
                    translationKeys = column.values;
                }
                else {
                    translations[header] = translationKeys.reduce(function (acc, i, idx) {
                        var _a;
                        if (idx < 2) {
                            return acc;
                        }
                        column.values = column.values || {};
                        var value = column.values[idx] || "";
                        if (i.includes(constants_1.separator)) {
                            var keys = i.split(constants_1.separator);
                            helpers_1.assign(acc, keys, value);
                            return acc;
                        }
                        return __assign({}, acc, (_a = {}, _a[i] = value, _a));
                    }, {});
                }
            });
            Object.entries(translations).forEach(function (_a) {
                var lang = _a[0], translations = _a[1];
                fs.writeFileSync(path.join(translationsPath, lang, worksheet.name), JSON.stringify(translations, null, "\t") + "\n");
            });
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=import.js.map