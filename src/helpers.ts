import * as path from "path"
import { CommanderStatic } from "commander"
import shelljs from "shelljs"

function throwError(message: string) {
    console.error(`Error: ${message}`)
    process.exit(1)
}

export function assign(obj: any, keyPath: any[], value: any): void {
    let lastKeyIndex = keyPath.length - 1

    for (let i = 0; i < lastKeyIndex; ++ i) {
        let key = keyPath[i]
        if (!(key in obj)){
            obj[key] = {}
        }
        obj = obj[key]
    }

    obj[keyPath[lastKeyIndex]] = value
}

export function removeDuplicates<T>(array: T[]): T[] {
    return Array.from(new Set(array))
}

export function programValidate(program: CommanderStatic): void {
    if (!program.import && !program.export) {
        throwError('Import/Export command missing')
    }
    if (program.import && program.export) {
        throwError("Can't choose both Import and Export")
    }

    if (!program.translations) {
        throwError('Path to translation directory is missing')
    } else if (!shelljs.test('-e', program.translations)) {
        throwError("Wrong path to locales directory")
    }

    if (!program.output) {
        throwError('Path to output excel file is missing')
    } else if (!shelljs.test('-e', program.output)) {
        if (program.import) {
            // throw an error if we want to import translations
            // from excel file
            throwError("Wrong path to excel file")
        } else {
            // create directories if we want to export
            // translations to excel file
            shelljs.mkdir('-p', path.dirname(program.output))
        }
    }
}
