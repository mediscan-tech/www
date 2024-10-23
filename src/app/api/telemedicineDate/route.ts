import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo/mongodb";

export async function POST(req: Request) {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("mediscan");

  try {
    const {
      patientClerkId,
      doctorClerkId,
      meetingDateTime,
      timeZone,
      roomID,
      patientName,
      doctorName,
    } = await req.json();

    if (
      !patientClerkId ||
      !doctorClerkId ||
      !meetingDateTime ||
      !timeZone ||
      !roomID
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db.collection("schedules").insertOne({
      patientClerkId,
      doctorClerkId,
      meetingDateTime: new Date(meetingDateTime).toISOString(),
      timeZone,
      roomID,
      patientName,
      doctorName,
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
