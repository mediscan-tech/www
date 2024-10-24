"use client";

import CardSkeleton from "@/components/ui/card-skeleton";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";

export default function SkinModelPage() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = async (files: File[]) => {
    setFiles(files);

    if (files.length > 0) {
      const file = files[0]; // Get the first (and only) file

      try {
        // Read the file as a base64 encoded string
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Create the payload
        const payload = {
          model_type: "skin",
          image: base64Image.split(",")[1], // Remove the data URL prefix
        };

        // Make the POST request
        const response = await fetch("https://api.mediscan.care/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Success:", result);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center pt-[104px]">
      <CardSkeleton className="w-full max-w-4xl mx-auto min-h-96">
        <FileUpload onChange={handleFileUpload} />
      </CardSkeleton>
    </div>
  );
}
