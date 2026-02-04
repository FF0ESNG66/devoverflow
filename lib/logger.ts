import pino from "pino";

const isEdge = process.env.NEXT_RUNTIME === "edge";  // pino pretty have issues working with Edge runtime when used with NextAuth
const isProduction = process.env.NODE_ENV === "production";  // So we're not goinmg to use pino pretty in prod, just locally

const logger = pino({
    level: process.env.LOG_LEVEL || "info",  // deciding which level of loggin we're going to use
    transport: !isEdge && !isProduction ? {
        target: "pino-pretty",
        options: {
            colorize: true,
            ignore: 'pid, hostname',
            translateTime: "SYS:standard",
        }
    } : undefined,
    formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger