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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
function setTranslationData(translationObj, translations, lang) {
    Object.entries(translations).forEach(function (_a) {
        var _b;
        var langKey = _a[0], trans = _a[1];
        translationObj[langKey] = translationObj[langKey] || {};
        if (trans && typeof trans === "object") {
            translationObj[langKey].nested = true;
            setTranslationData(translationObj[langKey], trans, lang);
        }
        else {
            translationObj[langKey] = __assign(__assign({}, translationObj[langKey]), (_b = {}, _b[lang] = trans, _b));
        }
    });
}
function getTranslationData(data) {
    var translationData = {};
    Object.entries(data).forEach(function (_a) {
        var lang = _a[0], translations = _a[1];
        setTranslationData(translationData, translations, lang);
    });
    return translationData;
}
function worksheetAddRow(value, key, worksheet) {
    delete value.nested;
    Object.entries(value).forEach(function (_a) {
        var nestedKey = _a[0], nestedValue = _a[1];
        var newKey = key ? "" + key + constants_1.separator + nestedKey : nestedKey;
        if (nestedValue.nested) {
            worksheetAddRow(nestedValue, newKey, worksheet);
        }
        else {
            worksheet.addRow(__assign({ key: newKey }, nestedValue));
        }
    });
}
function default_1(outputPath, translationsPath) {
    var workbook = new exceljs_1.Workbook();
    // todo: get creator from config or package.json
    workbook.creator = 'i18next-manager';
    workbook.created = new Date();
    var languages = fs.readdirSync(translationsPath);
    var allFiles = languages.reduce(function (acc, lang) { return (__spreadArrays(acc, fs.readdirSync(path.join(translationsPath, lang)))); }, []);
    var files = helpers_1.removeDuplicates(allFiles).sort();
    files.forEach(function (file) {
        var worksheet = workbook.addWorksheet(file, { views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }] });
        var langData = {};
        var columns = [
            { header: 'Key', key: 'key', width: 50 },
        ];
        languages.forEach(function (lang) {
            columns.push({ header: lang, key: lang, width: 65 });
            var rawJsonData = fs.readFileSync(path.join(translationsPath, lang, file), 'utf8');
            langData[lang] = JSON.parse(rawJsonData);
        });
        worksheet.columns = columns;
        var translationData = getTranslationData(langData);
        worksheetAddRow(translationData, null, worksheet);
    });
    workbook.xlsx.writeFile(outputPath)
        .then(function (workbook) {
        // use workbook
        console.log(workbook);
    });
}
exports.default = default_1;
//# sourceMappingURL=export.js.map