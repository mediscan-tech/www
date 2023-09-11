import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo/mongodb';
import { Document, WithId } from 'mongodb';

interface ImageData {
    ut_key: string;
    prediction: string;
}

async function fetchKey(key: string | null): Promise<ImageData | null> {
    const mongoClient = await clientPromise;
    const db = mongoClient.db("mediscan");
    const collection = db.collection("images");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const ut_keyDoc: WithId<Document> | null = await collection.findOne({ ut_key: key });
    
    if (ut_keyDoc === null) {
        return null;
    } else {
        const ut_key = {
            ut_key: ut_keyDoc.ut_key,
            prediction: ut_keyDoc.prediction, // Adjust this to the actual property name
        } as ImageData;

        return ut_key;
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key: string | null = searchParams.get('key');
    const data = await fetchKey(key);
    return NextResponse.json({ prediction: data?.prediction ?? null });
}
