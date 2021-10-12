"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nanoid = void 0;
const nanoid_1 = require("nanoid");
//@ts-ignore
const nanoid_dictionary_1 = require("nanoid-dictionary");
exports.nanoid = (size = 10) => {
    return nanoid_1.customAlphabet(nanoid_dictionary_1.alphanumeric, size)();
};
