"use client";

import CardSkeleton from "@/components/ui/card-skeleton";
import { FileUpload } from "@/components/ui/file-upload";
import ParticleSwarmLoader from "@/components/ui/particle-swarm-loader";
import { useState } from "react";

export default function SkinModelPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [model, setModel] = useState("skin");
  const [generation, setGeneration] = useState(null);
  const [disease, setDisease] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    setIsLoading(true);

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
          throw new Error(`Model error! status: ${response.status}`);
        }

        const result = await response.json();

        console.log(result);

        let groqBody = {
          model_type: model,
          predicted_class_name: result.predicted_class,
        };

        setDisease(result.predicted_class);

        const getCompletionFromGroq = await fetch("/api/self-diagnose-gen", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(groqBody), // Send the result object directly
        });

        if (!getCompletionFromGroq.ok) {
          throw new Error(`Groq error! status: ${response.status}`);
        }

        const groqResult = await getCompletionFromGroq.json();
        setGeneration(groqResult.generation);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelectChange = (event: any) => {
    setModel(event.target.value);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center pt-[104px]">
      <form className="w-full max-w-4xl items-center justify-center text-center ">
        <div className="w-full text-start">
          <label>I want to diagnose a:</label>
          <select
            className="mb-4 h-10 bg-bg-light/70"
            onChange={handleSelectChange}
          >
            <option value="skin">Skin Condition</option>
            <option value="mouth">Mouth Condition</option>
            <option value="nail">Nail Condition</option>
          </select>
        </div>
        <CardSkeleton className="mx-auto min-h-96 w-full">
          <FileUpload onChange={handleFileUpload} />
        </CardSkeleton>

        {isLoading ? (
          <div className="mt-4 flex items-center justify-center">
            <ParticleSwarmLoader />
          </div>
        ) : generation ? (
          <CardSkeleton className="mb-48 mt-4 p-6">
            <p>Self-Diagnosis Prediction</p>
            <h1 className="mb-2 text-2xl font-bold text-text-light">
              {disease}
            </h1>
            <p className="text-sm">{generation}</p>
          </CardSkeleton>
        ) : null}
      </form>
    </div>
  );
}
