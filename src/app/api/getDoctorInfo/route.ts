import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server"; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clerkId = searchParams.get("clerkId");

  if (!clerkId) {
    return NextResponse.json({ error: "Clerk ID is required" }, { status: 400 });
  }

  try {
    const user = await clerkClient.users.getUser(clerkId);
    const email = user?.emailAddresses?.[0]?.emailAddress;
    const profilePicture = user?.imageUrl;

    return NextResponse.json({ email, profilePicture });
  } catch (error) {
    console.error("Error fetching user email:", error);
    return NextResponse.json(
      { error: "Error fetching user email" },
      { status: 500 }
    );
  }
}
