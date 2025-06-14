export class Logger {
    static log(message: string, ...args: any[]) {
        console.log(`[${new Date().toISOString()}] ${message}`, ...args);
    }

    static error(message: string, ...args: any[]) {
        console.error(`[${new Date().toISOString()}] ERROR: ${message}`, ...args);
    }

    static warn(message: string, ...args: any[]) {
        console.warn(`[${new Date().toISOString()}] WARN: ${message}`, ...args);
    }

    static info(message: string, ...args: any[]) {
        console.info(`[${new Date().toISOString()}] INFO: ${message}`, ...args);
    }
}