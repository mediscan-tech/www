// src/app/api/schedules/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo/mongodb";
import { unstable_noStore as noStore } from 'next/cache';


export async function GET() {
  // Call noStore to prevent caching
  noStore();

  const mongoClient = await clientPromise;
  const db = mongoClient.db("mediscan");

  try {
    const schedules = await db.collection("schedules").find().toArray();
    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { message: "Error fetching schedules" },
      { status: 500 }
    );
  }
}