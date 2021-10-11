"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.get = exports.redis = exports.sub = exports.pub = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config = process.env.DATABASE_URL;
exports.pub = new ioredis_1.default(config);
exports.sub = new ioredis_1.default(config);
exports.redis = new ioredis_1.default(config);
const get = (key) => {
    return new Promise((res) => {
        exports.redis.get(key, (err, result) => {
            return res(result);
        });
    });
};
exports.get = get;
const set = (key, value) => exports.redis.set(key, value);
exports.set = set;
