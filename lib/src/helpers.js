"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    if (!program.output) {
        throwError('Path to output excel file is missing');
    }
}
exports.programValidate = programValidate;
//# sourceMappingURL=helpers.js.map