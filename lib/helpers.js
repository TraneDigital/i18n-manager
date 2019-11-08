"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
function throwError(message) {
    console.error(`Error: ${message}`);
    process.exit(1);
}
function assign(obj, keyPath, value) {
    let lastKeyIndex = keyPath.length - 1;
    for (let i = 0; i < lastKeyIndex; ++i) {
        let key = keyPath[i];
        if (!(key in obj)) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
}
exports.assign = assign;
function removeDuplicates(array) {
    return Array.from(new Set(array));
}
exports.removeDuplicates = removeDuplicates;
function programValidate(program) {
    if (!program.import && !program.export) {
        throwError('Import/Export command missing');
    }
    if (program.import && program.export) {
        throwError("Can't choose both Import and Export");
    }
    if (!program.translations) {
        throwError('Path to translation directory is missing');
    }
    else if (!shelljs_1.default.test('-e', program.translations)) {
        throwError("Wrong path to locales directory");
    }
    if (!program.output) {
        throwError('Path to output excel file is missing');
    }
    else if (!shelljs_1.default.test('-e', program.output)) {
        if (program.import) {
            // throw an error if we want to import translations
            // from excel file
            throwError("Wrong path to excel file");
        }
        else {
            // create directories if we want to export
            // translations to excel file
            shelljs_1.default.mkdir('-p', path.dirname(program.output));
        }
    }
}
exports.programValidate = programValidate;
//# sourceMappingURL=helpers.js.map