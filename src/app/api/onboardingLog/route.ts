import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo/mongodb";
import { Document, WithId } from "mongodb";

interface UserData {
  clerk_id: string;
  name: string;
  phoneNumber: string;
  degree?: string;
  practiceLocation?: string;
  address?: string;
  healthCondition?: string;
}

export async function POST(req: Request) {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("mediscan");

  try {
    const body = await req.json();
    const {
      userId,
      userType,
      name,
      phoneNumber,
      degree,
      practiceLocation,
      address,
      healthCondition,
    } = body;

    const existingDoctor = await db
      .collection("doctors")
      .findOne({ clerk_id: userId });
    const existingPatient = await db
      .collection("patients")
      .findOne({ clerk_id: userId });

    if (userType === "doctor" && existingPatient) {
      await db.collection("patients").deleteOne({ clerk_id: userId });
    } else if (userType === "patient" && existingDoctor) {
      await db.collection("doctors").deleteOne({ clerk_id: userId });
    }

    const userData: UserData = {
      clerk_id: userId,
      name,
      phoneNumber,
      ...(userType === "doctor"
        ? { degree, practiceLocation, address }
        : { healthCondition }),
    };

    const collection =
      userType === "doctor"
        ? db.collection("doctors")
        : db.collection("patients");
    await collection.updateOne(
      { clerk_id: userId },
      { $set: userData },
      { upsert: true }
    );

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}
