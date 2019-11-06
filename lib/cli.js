"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var import_1 = __importDefault(require("./src/import"));
var export_1 = __importDefault(require("./src/export"));
commander_1.default
    // todo: get version from config or package.json
    .version("0.0.1", '-v, --version', 'Output the current version')
    .option('-i, --import', 'Import translations from excel')
    .option('-e, --export', 'Export translations to excel')
    .option('-t, --translations <translations-path>', 'Path to translation directory')
    .option('-o, --output <output-path>', 'Path to output excel file');
commander_1.default.parse(process.argv);
// validation
if (!commander_1.default.import && !commander_1.default.export) {
    console.error('Import/Export command missing');
    process.exit(1);
}
if (commander_1.default.import && commander_1.default.export) {
    console.error("Can't choose both Import and Export");
    process.exit(1);
}
if (!commander_1.default.translations) {
    console.error('Path to translation directory is missing');
    process.exit(1);
}
if (!commander_1.default.output) {
    console.error('Path to output excel file is missing');
    process.exit(1);
}
// script execution
if (commander_1.default.import) {
    import_1.default(commander_1.default.output, commander_1.default.translations);
}
if (commander_1.default.export) {
    export_1.default(commander_1.default.output, commander_1.default.translations);
}
//# sourceMappingURL=cli.js.map