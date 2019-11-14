"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');
function throwError(message) {
    console.error(`Error: ${message}`);
    process.exit(1);
}
function prettifyJson(object) {
    return JSON.stringify(object, null, "\t") + "\n";
}
exports.prettifyJson = prettifyJson;
function getAuthor() {
    if (shelljs_1.default.which('git')) {
        const { stdout: gitName } = shelljs_1.default.exec('git config user.name', { silent: true });
        const { stdout: gitGlobalName } = shelljs_1.default.exec('git config --global user.name', { silent: true });
        const author = (gitName || gitGlobalName).replace("\n", "");
        if (author) {
            return `${author} (${pkg.name})`;
        }
    }
    return pkg.name;
}
exports.getAuthor = getAuthor;
/**
 * Validate input options
 * if not valid exit with code 1
 * @param {CommanderStatic} program
 */
function programValidate(program) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!program.import && !program.export) {
            throwError('Import/Export command missing');
        }
        if (program.import && program.export) {
            throwError("Can't choose both Import and Export");
        }
        // Check if path exist for translation-assets-dir option
        if (!shelljs_1.default.test('-e', program.translationAssetsDir)) {
            throwError("Wrong path to locales directory");
        }
        // Check if path exist for translation-file option
        if (!shelljs_1.default.test('-e', program.translationFile)) {
            if (program.import) {
                // throw an error if we want to import translations
                // from excel file
                throwError("Wrong path to excel file");
            }
            else {
                // create directories if we want to export
                // translations to excel file
                yield shelljs_1.default.mkdir('-p', path.dirname(program.translationFile));
            }
        }
    });
}
exports.programValidate = programValidate;
//# sourceMappingURL=helpers.js.map