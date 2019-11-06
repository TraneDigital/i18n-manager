"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assign(obj, keyPath, value) {
    var lastKeyIndex = keyPath.length - 1;
    for (var i = 0; i < lastKeyIndex; ++i) {
        var key = keyPath[i];
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
//# sourceMappingURL=helpers.js.map