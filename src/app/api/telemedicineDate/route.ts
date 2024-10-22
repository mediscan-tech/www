import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo/mongodb";

export async function POST(req: Request) {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("mediscan");

  try {
    const { patientClerkId, doctorClerkId, meetingDateTime, timeZone } =
      await req.json();

    // Validate input
    if (!patientClerkId || !doctorClerkId || !meetingDateTime || !timeZone) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert the meeting data into the schedules collection
    const result = await db.collection("schedules").insertOne({
      patientClerkId,
      doctorClerkId,
      meetingDateTime,
      timeZone,
      createdAt: new Date(),
    });

    if (result.acknowledged) {
      return NextResponse.json(
        { message: "Meeting scheduled successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to schedule meeting" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
