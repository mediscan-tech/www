import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongo/mongodb';
 
async function fetchKey(key: string | null) {
    const mongoClient = await clientPromise;
    const db = mongoClient.db("mediscan");
    const collection = db.collection("images");
    await new Promise((resolve) => setTimeout(resolve, 10000)); //TODO: figure out race condition - make a polling function that checks if the key is in the database
    let ut_key = await collection
        .findOne( { ut_key: key } )
    if (ut_key === null) {
        return null;
    } else {
        return ut_key;
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    let key: string | null = searchParams.get('key')
    const data = await fetchKey(key)
    return NextResponse.json({ prediction: data?.prediction ?? null }) //the 'data?' is optional chaining. the ?? is nullish coalescing so if data is null, it will return null
}