"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast"; // Import useToast
import { useRouter } from "next/navigation"; // Import useRouter

// Doctor schema
const doctorSchema = z.object({
  name: z.string().min(3, "Name is required"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  degree: z.string().min(4, "Medical degree is required"),
  practiceLocation: z.string().min(4, "Practice location is required"),
});

// Patient Schema
const patientSchema = z.object({
  name: z.string().min(3, "Name is required"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  healthCondition: z.string().optional(),
});

export default function OnboardingPage() {
  const { toast } = useToast(); // Initialize the toast function
  const router = useRouter(); // Initialize router for redirection
  const { user } = useUser();
  const [userType, setUserType] = useState<"doctor" | "patient" | null>(null);

  const schema = userType === "doctor" ? doctorSchema : patientSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const userId = user?.id;

    try {
      const response = await fetch("/api/onboardingLog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userType,
          ...data,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success! 🎉",
          description: "Successfully added to the directory!",
        });
        // Automatically redirect to /directory after a short delay
        setTimeout(() => {
          router.push("/directory");
        }, 2000); // Adjust the delay as needed (2000ms = 2 seconds)
      } else {
        toast({
          title: "Error submitting form! ❌",
          description: "There was a problem with your submission.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error! ❌",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black py-10">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold text-white">
          Onboarding Form
        </h1>

        <div className="mt-6">
          <label className="font-medium text-white">
            Are you signing up as a doctor or patient?
          </label>
          <div>
            <select
              value={userType ?? ""}
              onChange={(e) =>
                setUserType(e.target.value as "doctor" | "patient")
              }
              className="w-full rounded border px-4 py-2 text-black"
            >
              <option value="">Select...</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>
        </div>

        {userType && (
          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-white">Name</label>
                <input
                  placeholder="Bob Joe"
                  type="text"
                  {...register("name")}
                  className="w-full rounded border px-4 py-2 text-black"
                />
                {errors.name && (
                  <p className="text-red-500">
                    {(errors.name as any)?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-white">Phone Number</label>
                <input
                  placeholder="1234567890"
                  type="text"
                  {...register("phoneNumber")}
                  className="w-full rounded border px-4 py-2 text-black"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500">
                    {(errors.phoneNumber as any)?.message}
                  </p>
                )}
              </div>

              {userType === "doctor" && (
                <>
                  <div>
                    <label className="text-white">Medical Degree</label>
                    <input
                      placeholder="Bachelor of Dental Surgery"
                      type="text"
                      {...register("degree")}
                      className="w-full rounded border px-4 py-2 text-black"
                    />
                    {errors.degree && (
                      <p className="text-red-500">
                        {(errors.degree as any)?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-white">Practice Location</label>
                    <input
                      placeholder="Mercy Hospital St. Louis"
                      type="text"
                      {...register("practiceLocation")}
                      className="w-full rounded border px-4 py-2 text-black"
                    />
                    {errors.practiceLocation && (
                      <p className="text-red-500">
                        {(errors.practiceLocation as any)?.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {userType === "patient" && (
                <div>
                  <label className="text-white">
                    Pre-existing Health Condition (Optional)
                  </label>
                  <input
                    placeholder="Ex: Melanoma, Gingivitis, Pitting"
                    type="text"
                    {...register("healthCondition")}
                    className="w-full rounded border px-4 py-2 text-black"
                  />
                </div>
              )}

              <button
                type="submit"
                className="rounded bg-blue-500 px-6 py-2 text-white"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}