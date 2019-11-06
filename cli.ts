import program from "commander"
import importTranslations from "./src/import"
import exportTranslations from "./src/export"

program
    // todo: get version from config or package.json
    .version("0.0.1", '-v, --version', 'Output the current version')
    .option('-i, --import', 'Import translations from excel')
    .option('-e, --export', 'Export translations to excel')
    .option('-t, --translations <translations-path>', 'Path to translation directory')
    .option('-o, --output <output-path>', 'Path to output excel file')

program.parse(process.argv)



// validation
if (!program.import && !program.export) {
    console.error('Import/Export command missing');
    process.exit(1);
}
if (program.import && program.export) {
    console.error("Can't choose both Import and Export");
    process.exit(1);
}
if (!program.translations) {
    console.error('Path to translation directory is missing');
    process.exit(1);
}
if (!program.output) {
    console.error('Path to output excel file is missing');
    process.exit(1);
}



// script execution
if (program.import) {
    importTranslations(program.output, program.translations);
}

if (program.export) {
    exportTranslations(program.output, program.translations);
}

