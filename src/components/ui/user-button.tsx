"use client";

import { UserButton as ClerkUserButton, useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserButton() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <Skeleton className="h-[50px] w-[50px] rounded-full" />;
  }

  return (
    <div>
      <ClerkUserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonAvatarBox: {
              height: "40px",
              width: "40px",
            },
          },
        }}
      />
    </div>
  );
}
