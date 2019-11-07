#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const helpers_1 = require("./src/helpers");
const import_1 = __importDefault(require("./src/import"));
const export_1 = __importDefault(require("./src/export"));
commander_1.default
    // todo: get version from config or package.json
    .version("0.0.1", '-v, --version', 'Output the current version')
    .option('-i, --import', 'Import translations from excel')
    .option('-e, --export', 'Export translations to excel')
    .option('-t, --translations <translations-path>', 'Path to translation directory')
    .option('-o, --output <output-path>', 'Path to output excel file');
commander_1.default.parse(process.argv);
helpers_1.programValidate(commander_1.default);
// script execution
if (commander_1.default.import) {
    import_1.default(commander_1.default.output, commander_1.default.translations);
}
if (commander_1.default.export) {
    export_1.default(commander_1.default.output, commander_1.default.translations);
}
//# sourceMappingURL=index.js.map