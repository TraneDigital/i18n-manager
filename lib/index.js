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
var fs = __importStar(require("fs"));
var exceljs_1 = require("exceljs");
var separator = "::";
function assign(obj, keyPath, value) {
    var lastKeyIndex = keyPath.length - 1;
    for (var i = 0; i < lastKeyIndex; ++i) {
        var key = keyPath[i];
        if (!(key in obj)) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
}
var workbook = new exceljs_1.Workbook();
workbook.xlsx.readFile('./Bar.xlsx')
    .then(function (workbook) {
    // use workbook
    workbook.worksheets.forEach(function (worksheet) {
        console.log(worksheet.name);
        var translationKeys = [];
        var translations = {};
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
                    if (i.includes(separator)) {
                        var keys = i.split(separator);
                        assign(acc, keys, value);
                        return acc;
                    }
                    return __assign(__assign({}, acc), (_a = {}, _a[i] = value, _a));
                }, {});
            }
        });
        console.log(translations);
        Object.entries(translations).forEach(function (_a) {
            var lang = _a[0], translations = _a[1];
            fs.writeFileSync("./locales/" + lang + "/" + worksheet.name, JSON.stringify(translations, null, "\t") + "\n");
        });
    });
});
/*
const workbook = new Workbook();
workbook.creator = 'Me';
workbook.created = new Date();

const languages = fs.readdirSync("./locales");

const files = [...new Set(languages.reduce((acc, lan) => ([
    ...acc,
    ...fs.readdirSync(`./locales/${lan}`),
]), []))].sort();


function getTransData(data) {
    let langData = {};

    function setTransData(transObj, translations, lang) {
        Object.entries(translations).forEach(([langKey, trans]) => {
            transObj[langKey] = transObj[langKey] || {};

            if (trans && typeof trans === "object") {
                transObj[langKey].nested = true;
                setTransData(transObj[langKey], trans, lang)
            } else {
                transObj[langKey] = {
                    ...transObj[langKey],
                    [lang]: trans,
                }
            }
        })
    }

    Object.entries(data).forEach(([lang, translations]) => {
        setTransData(langData, translations, lang);
    });

    return langData;
}

files.forEach(file => {
    const worksheet = workbook.addWorksheet(file, {views:[{state: 'frozen', xSplit: 1, ySplit: 1}]});
    const langData = {};

    const columns = [
        { header: 'Key', key: 'key', width: 50 },
    ];


    languages.forEach(lang => {
        columns.push({ header: lang, key: lang, width: 65 });
        langData[lang] = require(`./locales/${lang}/${file}`);
    });
    worksheet.columns = columns;

    const translationData = getTransData(langData);

    console.log(translationData);

    function worksheetAddRow(value, key) {
        delete value.nested;

        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            const newKey = key ? `${key}${separator}${nestedKey}` : nestedKey;
            if (nestedValue.nested) {
                worksheetAddRow(nestedValue, newKey);
            } else {
                worksheet.addRow({
                    key: newKey,
                    ...nestedValue,
                });
            }
        });
    }

    worksheetAddRow(translationData);

});


workbook.xlsx.writeFile('./Bar.xlsx')
    .then(workbook => {
        // use workbook
        debugger;
        console.log(workbook);

    });

 */
//# sourceMappingURL=index.js.map