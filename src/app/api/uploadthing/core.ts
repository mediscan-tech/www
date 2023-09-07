import { createUploadthing, type FileRouter } from "uploadthing/next";
import clientPromise from '@/lib/mongo/mongodb';

const f = createUploadthing();
 
// FileRouter for our app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(({ }) => {
      // This code runs on our server before upload
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { status: "uploaded" };
    })
    .onUploadComplete(async ({ file }) => {
      // This code RUNS OUR SERVER after upload
      // Get the actual image data from the URL
      const response = await fetch(file.url);
      const imageBlob = await response.blob();

      const formData = new FormData();
      let modelData = null;
      formData.append('image', imageBlob, file.name);

      try {
        const apiResponse = await fetch('https://api.mediscan.tech/predict', {
          method: 'POST',
          body: formData,
        });

        if (!apiResponse.ok) {
          throw new Error(`API request failed with status ${apiResponse.status}`);
        }

        modelData = await apiResponse.json();

        const mongoClient = await clientPromise;
        const db = mongoClient.db("mediscan");
        const collection = db.collection("images");
        const doc = {
          ut_key: file.key,
          prediction: modelData.predicted_class,
        }

        let result = await collection.insertOne(doc);
      } catch (error) {
        console.error('Error sending image to API:', error);
      }
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;