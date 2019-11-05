const fs = require('fs');
const ExcelJS = require('exceljs');

/*const workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile('./Foo.xlsx')
    .then(workbook => {
        // use workbook
        debugger;
        console.log(workbook);

    });*/

const workbook = new ExcelJS.Workbook();
workbook.creator = 'Me';
workbook.created = new Date();

const languages = fs.readdirSync("./locales");

const files = [...new Set(languages.reduce((acc, lan) => ([
    ...acc,
    ...fs.readdirSync(`./locales/${lan}`),
]), []))].sort();

files.forEach(file => {
    const worksheet = workbook.addWorksheet(file, {views:[{state: 'frozen', xSplit: 1, ySplit: 1}]});
    const langData = {};

    const columns = [
        { header: 'Key', key: 'key', width: 20 },
    ];


    languages.forEach(lang => {
        columns.push({ header: lang, key: lang, width: 20 });
        langData[lang] = require(`./locales/${lang}/${file}`);
    });


    worksheet.columns = columns;
});


workbook.xlsx.writeFile('./Bar.xlsx')
    .then(workbook => {
        // use workbook
        debugger;
        console.log(workbook);

    });
