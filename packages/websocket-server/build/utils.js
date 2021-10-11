"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nanoid = void 0;
const nanoid_1 = require("nanoid");
//@ts-ignore
const nanoid_dictionary_1 = require("nanoid-dictionary");
const nanoid = (size = 10) => {
    return (0, nanoid_1.customAlphabet)(nanoid_dictionary_1.alphanumeric, size)();
};
exports.nanoid = nanoid;
