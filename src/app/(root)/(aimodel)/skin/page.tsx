"use client";

import CardSkeleton from "@/components/ui/card-skeleton";
import { FileUpload } from "@/components/ui/file-upload";
import { useEffect, useState } from "react";

export default function SkinModelPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [model, setModel] = useState("skin");
  
  const handleFileUpload = async (files: File[]) => {
    setFiles(files);

    if (files.length > 0) {
      const file = files[0]; // Get the first (and only) file

      try {
        // Create a FormData object
        const formData = new FormData();
        formData.append("model_type", model);
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

  const handleSelectChange = (event: any) => {
    setModel(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    alert(`You selected the ${model} model.`);
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center pt-[104px]">
      <form className="items-center justify-center w-full max-w-4xl text-center">
        <div className="w-full text-start">
          <label>I want to diagnose:</label>
          <select className="h-10 mb-4 bg-bg-light/70" onChange={handleSelectChange}>
            <option value="skin">Skin</option>
            <option value="mouth">Mouth</option>
            <option value="nail">Nail</option>
          </select>
        </div>
        <CardSkeleton className="w-full mx-auto min-h-96">
          <FileUpload onChange={handleFileUpload} />
        </CardSkeleton>
        <button type="submit" onClick={handleSubmit} className="w-1/2 py-2 mt-4 font-bold border rounded-lg border-primary/80 bg-primary/10 text-primary">Analyze Image</button>
      </form>
    </div>
  );
}
