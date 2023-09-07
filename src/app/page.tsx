"use client";

import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
export default function HomePage() {
  const [prediction, setPrediction] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <UploadButton
          endpoint="imageUploader"
          onUploadBegin={() => {
            alert("Upload Completed! Waiting for AI to process...");
          }}
          onClientUploadComplete={async (res: Promise<any>) => {
            if (res && Array.isArray(res) && res.length > 0) {
              try {
                const response = await fetch(`/api/getPrediction?key=${res[0].key}`);
                if (response.ok) {
                  const data = await response.json(); // Parse the response as JSON
                  setPrediction(data.prediction); // Set the prediction in the state
                } else {
                  alert("Error fetching prediction data.");
                }
              } catch (error) {
                alert("An error occurred while fetching prediction data.");
                console.error(error);
              }
            } else {
              alert("Upload Completed, but the response is undefined.");
            }
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
        {prediction && ( // Conditionally render and show prediction
          <div>
            <p>Prediction:</p>
            <p>{prediction}</p>
          </div>
        )}
      </div>
    </main>
  );
}