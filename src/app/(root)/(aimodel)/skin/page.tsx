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
        // Create a FormData object
        const formData = new FormData();
        formData.append("model_type", "skin");
        formData.append("image", file);

        // Make the POST request
        const response = await fetch("https://api.mediscan.care/predict", {
          method: "POST",
          // Don't set Content-Type header, it will be set automatically
          body: formData, // Send the FormData object directly
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json(); // this is the result from the API
        // { confidence: 1, predicted_class: "Melanoma Skin Cancer Nevi and Moles" }
        console.log("Success:", result);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center pt-[104px]">
      <CardSkeleton className="mx-auto min-h-96 w-full max-w-4xl">
        <FileUpload onChange={handleFileUpload} />
      </CardSkeleton>
    </div>
  );
}
