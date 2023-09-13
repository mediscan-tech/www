import { MongoClient } from 'mongodb';

const uri: string | undefined = process.env.MONGODB_URI;

declare const globalThis: {
    _mongoClientPromise?: Promise<MongoClient>;
};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

if (!uri) throw new Error("Please add your Mongo URI to .env")

if (process.env.NODE_ENV === 'development') {
    if (!globalThis._mongoClientPromise) {
        client = new MongoClient(uri);
        globalThis._mongoClientPromise = client.connect();
    }
    clientPromise = globalThis._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;