import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo/mongodb";

export async function GET() {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("mediscan");

  try {
    const doctors = await db.collection("doctors").find().toArray();
    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { message: "Error fetching doctors" },
      { status: 500 }
    );
  }
}
