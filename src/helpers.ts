import * as path from "path"
import { CommanderStatic } from "commander"
import shelljs from "shelljs"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json')

function throwError(message: string): void {
    console.error(`Error: ${message}`)
    process.exit(1)
}

export function prettifyJson<T>(object: T): string {
    return JSON.stringify(object, null, "\t") + "\n"
}

export function getAuthor(): string {
    if (shelljs.which('git')) {
        const { stdout: gitName } = shelljs.exec('git config user.name', { silent: true })
        const { stdout: gitGlobalName } = shelljs.exec('git config --global user.name', { silent: true })
        const author = (gitName || gitGlobalName).replace("\n", "")

        if (author) {
            return `${author} (${pkg.name})`
        }
    }

    return pkg.name
}

/**
 * Validate input options
 * if not valid exit with code 1
 * @param {CommanderStatic} program
 */
export async function programValidate(program: CommanderStatic): Promise<void> {
    if (!program.import && !program.export) {
        throwError('Import/Export command missing')
    }
    if (program.import && program.export) {
        throwError("Can't choose both Import and Export")
    }

    // Check if path exist for translation-assets-dir option
    if (!shelljs.test('-e', program.translationAssetsDir)) {
        throwError("Wrong path to locales directory")
    }

    // Check if path exist for translation-file option
    if (!shelljs.test('-e', program.translationFile)) {
        if (program.import) {
            // throw an error if we want to import translations
            // from excel file
            throwError("Wrong path to excel file")
        } else {
            // create directories if we want to export
            // translations to excel file
            await shelljs.mkdir('-p', path.dirname(program.translationFile))
        }
    }
}
