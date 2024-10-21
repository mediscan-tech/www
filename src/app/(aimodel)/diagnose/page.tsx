"use client";

import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
export default function HomePage() {
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {prediction && (
          <div>
            <p className="text-2xl">
              <strong>Prediction: </strong>
              {prediction}
            </p>
          </div>
        )}

        {!prediction && !loading && (
          <UploadButton
            endpoint="imageUploader"
            onUploadBegin={() => {
              alert("Upload Completed! Waiting for AI to process...");
              setLoading(true);
            }}
            onClientUploadComplete={async (res: any) => {
              if (res && Array.isArray(res) && res.length > 0) {
                try {
                  const response = await fetch(
                    `/api/getPrediction?key=${res[0].key}`
                  );
                  if (response.ok) {
                    const data = await response.json(); // Parse the response as JSON
                    setPrediction(data.prediction);
                    setLoading(false); // Set the prediction in the state
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
        )}

        {!prediction && loading && (
          <div className="text-center">
            <h1 className="text-2xl">
              Please wait 15-20 seconds for the AI to process...
            </h1>
            <div className="mt-4">
              <div className="animate-pulse text-4xl">&#9679;</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
