#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const helpers_1 = require("./helpers");
const import_1 = __importDefault(require("./import"));
const export_1 = __importDefault(require("./export"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');
commander_1.default
    .version(pkg.version, "-v, --version", "Output the current version")
    .option("-i, --import", "Import translations from excel")
    .option("-e, --export", "Export translations to excel")
    .requiredOption("-t, --translations <translations-path>", "Path to translation directory")
    .requiredOption("-o, --output <output-path>", "Path to output excel file");
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