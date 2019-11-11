#!/usr/bin/env node

import program from "commander"
import { programValidate } from "./helpers"
import importTranslations from "./import"
import exportTranslations from "./export"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json')

program
    .version(pkg.version, "-v, --version", "Output the current version")
    .option("-i, --import", "Import translations from excel")
    .option("-e, --export", "Export translations to excel")
    .requiredOption("-t, --translations <translations-path>", "Path to translation directory")
    .requiredOption("-o, --output <output-path>", "Path to output excel file")


program.parse(process.argv)
programValidate(program)


// script execution
if (program.import) {
    importTranslations(program.output, program.translations)
}
if (program.export) {
    exportTranslations(program.output, program.translations)
}

