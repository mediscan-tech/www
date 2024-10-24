"use client";

import CardSkeleton from "@/components/ui/card-skeleton";
import { FileUpload } from "@/components/ui/file-upload";
import { useEffect, useState } from "react";

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

  const [model, setModel] = useState("skin");

  const handleSelectChange = (event) => {
    setModel(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`You selected the ${model} model.`);
  };

  const [model, setModel] = useState("skin");

  const handleSelectChange = (event) => {
    setModel(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`You selected the ${model} model.`);
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center pt-[104px]">
      <form className="w-full max-w-4xl justify-center items-center text-center">
        <div className="w-full text-start">
          <label>I want to diagnose:</label>
          <select className="mb-4 h-10 bg-bg-light/70" onChange={handleSelectChange}>
            <option value="skin">Skin</option>
            <option value="mouth">Mouth</option>
            <option value="nail">Nail</option>
          </select>
        </div>
        <CardSkeleton className="mx-auto min-h-96 w-full">
          <FileUpload onChange={handleFileUpload} />
        </CardSkeleton>
        <button type="submit" onClick={handleSubmit} className="border border-primary/80 bg-primary/10 rounded-lg text-primary font-bold py-2 mt-4 w-1/2">Analyze Image</button>
      </form>
    </div>
  );
}
