"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docs = exports.persistenceDir = exports.CALLBACK_DEBOUNCE_MAXWAIT = exports.CALLBACK_DEBOUNCE_WAIT = exports.gcEnabled = exports.pingTimeout = exports.wsReadyStateConnecting = exports.wsReadyStateOpen = exports.messageAwareness = exports.messageSync = void 0;
exports.messageSync = 0;
exports.messageAwareness = 1;
exports.wsReadyStateOpen = 1;
exports.wsReadyStateConnecting = 0;
exports.pingTimeout = 30000;
// disable gc when using snapshots!
exports.gcEnabled = process.env.GC !== "false" && process.env.GC !== "0";
exports.CALLBACK_DEBOUNCE_WAIT = parseInt(process.env.CALLBACK_DEBOUNCE_WAIT) || 2000;
exports.CALLBACK_DEBOUNCE_MAXWAIT = parseInt(process.env.CALLBACK_DEBOUNCE_MAXWAIT) || 10000;
exports.persistenceDir = process.env.YPERSISTENCE;
exports.docs = new Map();
