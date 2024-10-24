// src/app/api/getDoctorEmail.ts
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server"; // Use the Clerk SDK for server-side operations

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clerkId = searchParams.get("clerkId");

  if (!clerkId) {
    return NextResponse.json({ error: "Clerk ID is required" }, { status: 400 });
  }

  try {
    // Fetch the user from Clerk using the Clerk SDK
    const user = await clerkClient.users.getUser(clerkId);
    const email = user?.emailAddresses?.[0]?.emailAddress;

    return NextResponse.json({ email });
  } catch (error) {
    console.error("Error fetching user email:", error);
    return NextResponse.json(
      { error: "Error fetching user email" },
      { status: 500 }
    );
  }
}
