import * as fs from 'fs';
import { Workbook } from "exceljs"

const separator = "::";

function assign(obj: any, keyPath: any[], value: any) {
    let lastKeyIndex = keyPath.length-1;
    for (let i = 0; i < lastKeyIndex; ++ i) {
        let key = keyPath[i];
        if (!(key in obj)){
            obj[key] = {}
        }
        obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
}

const workbook = new Workbook();
workbook.xlsx.readFile('./Bar.xlsx')
    .then(workbook => {
        // use workbook
        workbook.worksheets.forEach(worksheet => {
            console.log(worksheet.name);
            let translationKeys: any[] = [];
            const translations: any = {};

            worksheet.columns.forEach((column: any) => {
                const header = column.values[1];

                if (header === "Key") {
                    translationKeys = column.values
                } else {
                    translations[header] = translationKeys.reduce((acc, i, idx) => {
                        if (idx < 2) {
                            return acc;
                        }

                        column.values = column.values || {};

                        const value = column.values[idx] || "";

                        if (i.includes(separator)) {
                            const keys = i.split(separator);
                            assign(acc, keys, value);
                            return acc;
                        }

                        return {
                            ...acc,
                            [i]: value,
                        }
                    }, {})
                }
            });

            console.log(translations);

            Object.entries(translations).forEach(([lang, translations]) => {
                fs.writeFileSync(`./locales/${lang}/${worksheet.name}`, JSON.stringify(translations, null, "\t") + "\n");
            })
        })

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
