"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import CardSkeleton from "@/components/ui/card-skeleton";

// Zod Schema
const formSchema = z.object({
  age: z
    .string()
    .min(1, "Age is required")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "Age must be a valid number" })
    .refine((val) => val >= 0 && val <= 120, {
      message: "Age must be between 0 and 120",
    }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
  heightFeet: z
    .string()
    .min(1, "Height (feet) is required")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0 && val <= 8, {
      message: "Feet must be a number between 0 and 8",
    }),
  heightInches: z
    .string()
    .min(1, "Height (inches) is required")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0 && val <= 11, {
      message: "Inches must be a number between 0 and 11",
    }),
  weight: z
    .string()
    .min(1, "Weight is required")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "Weight must be a valid member" })
    .refine((val) => val >= 0 && val <= 500, {
      message: "Age must be between 0 and 500",
    }),
  injuryDescription: z.string().optional(),
  injuryDuration: z.string().optional(),
  conscious: z
    .string()
    .transform((val) => val === "true")
    .refine((val) => typeof val === "boolean", {
      message: "Conscious must be a boolean value",
    }),
  firstAid: z.string().optional(),
  currentSymptoms: z.string().min(1, "Current symptoms are required"),
  symptomDuration: z.string().min(1, "Duration of symptom is required"),
  symptomSeverity: z.enum(["Mild", "Moderate", "Severe"], {
    required_error: "Severity of symptom is required",
  }),
  familyHistory: z.string().optional(),
  currentMedications: z.string().optional(),
});

export default function DiagnosisForm() {
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const params = new URLSearchParams();

      console.log(Object.keys(data));

      Object.keys(data).forEach((key) => {
        params.append(key, data[key]);
      });

      router.push(`/chat?${params.toString()}`);

      // setTimeout(() => {
      //   router.push("/chat");
      // }, 2000);
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-black py-10 pt-32">
      <CardSkeleton className="w-full max-w-md p-6">
        <h1 className="mb-4 text-center text-2xl font-bold text-white">
          Diagnosis By Symptom
        </h1>
        <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div>
              <label>Age</label>
              <input
                type="number"
                placeholder="Enter your age"
                {...register("age")}
              />
              {errors.age?.message && (
                <p className="text-red-500">{(errors.age as any)?.message}</p>
              )}
            </div>

            <div>
              <label>Gender</label>
              <select {...register("gender")}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender?.message && (
                <p className="text-red-500">
                  {(errors.gender as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label>Height</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Feet"
                  {...register("heightFeet")}
                />
                <span>'</span>
                <input
                  type="number"
                  placeholder="Inches"
                  {...register("heightInches")}
                />
              </div>
              {errors.heightFeet?.message && (
                <p className="text-red-500">
                  {(errors.heightFeet as any)?.message}
                </p>
              )}
              {errors.heightInches?.message && (
                <p className="text-red-500">
                  {(errors.heightInches as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label>Weight</label>
              <input
                type="number"
                placeholder="Enter your weight in pounds"
                {...register("weight")}
              />
              {errors.weight?.message && (
                <p className="text-red-500">
                  {(errors.weight as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label>Description of Injury</label>
              <textarea
                placeholder="Describe the injury"
                {...register("injuryDescription")}
              />
              {errors.injuryDescription?.message && (
                <p className="text-red-500">
                  {(errors.injuryDescription as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label>How long ago did it happen?</label>
              <input
                type="text"
                placeholder="Duration (e.g., 2 hours ago)"
                {...register("injuryDuration")}
              />
              {errors.injuryDuration?.message && (
                <p className="text-red-500">
                  {(errors.injuryDuration as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label>Is the person conscious?</label>
              <select {...register("conscious")}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              {errors.conscious?.message && (
                <p className="text-red-500">
                  {(errors.conscious as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label>First Aid Administered (if any)</label>
              <textarea
                placeholder="Describe any first aid administered"
                {...register("firstAid")}
              />
              {errors.firstAid?.message && (
                <p className="text-red-500">
                  {(errors.firstAid as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label>Current Symptoms</label>
              <textarea
                placeholder="List current symptoms"
                {...register("currentSymptoms")}
              />
              {errors.currentSymptoms?.message && (
                <p className="text-red-500">
                  {(errors.currentSymptoms as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label>Duration of Symptom</label>
              <input
                type="text"
                placeholder="e.g., 3 days"
                {...register("symptomDuration")}
              />
              {errors.symptomDuration?.message && (
                <p className="text-red-500">
                  {(errors.symptomDuration as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label>Severity of Symptom</label>
              <select {...register("symptomSeverity")}>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
              {errors.symptomSeverity?.message && (
                <p className="text-red-500">
                  {(errors.symptomSeverity as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label>Family History of Medical Conditions</label>
              <textarea
                placeholder="Describe family medical history (if relevant)"
                {...register("familyHistory")}
              />
              {errors.familyHistory?.message && (
                <p className="text-red-500">
                  {(errors.familyHistory as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label>Current Medications</label>
              <textarea
                placeholder="List current medications"
                {...register("currentMedications")}
              />
              {errors.currentMedications?.message && (
                <p className="text-red-500">
                  {(errors.currentMedications as any)?.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className=" w-full rounded-lg border border-primary/80 bg-primary/10 py-2 font-bold text-primary "
            >
              Recieve Diagnosis
            </button>
          </div>
        </form>
      </CardSkeleton>
    </div>
  );
}
