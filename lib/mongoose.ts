import mongoose, { Mongoose } from "mongoose";
import logger from "./logger";


// Define MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI as string;

if(!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
}


interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}


declare global {
    // Using "var" so we can have a global version of the mongoose variable
    var mongoose: MongooseCache  // This is just for typescript
}

let cached = global.mongoose;

if(!cached) {
    // We're doing this becaise Next.js functions can be invoked multiple times, especially in development.
    // So without caching, each invocation create a new database connection, leading to resource exhaustion and potential
    // connection limits being reached
    cached = global.mongoose = { conn: null, promise: null };
}

// Establishing the connnection
const dbConnect = async (): Promise<Mongoose> => {   // Is going to return a Promise, so we define that type
    if(cached.conn) {
        logger.info("Using existing mongoose connection");
        return cached.conn; //Check if there's a cached connection and if so, return that one
    }

    // If not cache, then create a new PROMISE for connecting to the database
    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: "DevflowCluster",
        })
        .then((result) => {
            logger.info("Conected to MongoDB");
            return result;

        }).catch((error) => {
            logger.error("Error connecting to MongoDB", error);
            throw error;
        });
    }

    // wait (resolve) for the promise to resolve
    cached.conn = await cached.promise;

    return cached.conn;
};

export default dbConnect;