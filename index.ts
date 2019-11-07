#!/usr/bin/env node

import program from "commander"
import { programValidate } from "./src/helpers"
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
programValidate(program)



// script execution
if (program.import) {
    importTranslations(program.output, program.translations);
}

if (program.export) {
    exportTranslations(program.output, program.translations);
}

