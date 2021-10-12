export const messageSync = 0;
export const messageAwareness = 1;
export const wsReadyStateOpen = 1;
export const wsReadyStateConnecting = 0;
export const pingTimeout = 30000;

// disable gc when using snapshots!
export const gcEnabled = process.env.GC !== "false" && process.env.GC !== "0";

export const CALLBACK_DEBOUNCE_WAIT = parseInt(process.env.CALLBACK_DEBOUNCE_WAIT as string) || 20000;
export const CALLBACK_DEBOUNCE_MAXWAIT = parseInt(process.env.CALLBACK_DEBOUNCE_MAXWAIT as string) || 20000;

export const persistenceDir = process.env.YPERSISTENCE;

export const docs = new Map() as Map<string, any>;
