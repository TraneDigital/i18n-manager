#!/usr/bin/env node

import program from "commander"
import { programValidate } from "./helpers"
import importTranslations from "./import"
import exportTranslations from "./export"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json')

program
    .version(pkg.version, "-v, --version", "Output the current version")
    .option("-i, --import", "Import translations from excel file")
    .option("-e, --export", "Export translations to excel file")
    .requiredOption("-i18n, --translation-assets-dir <i18n-trans-path>", "Path to translation directory")
    .requiredOption("-xls, --translation-file <xls-file-path>", "Path to excel file")


program.parse(process.argv)
programValidate(program)
    .then(() => {
        // script execution
        if (program.import) {
            importTranslations(program.translationFile, program.translationAssetsDir)
        }
        if (program.export) {
            exportTranslations(program.translationFile, program.translationAssetsDir)
        }
    })

