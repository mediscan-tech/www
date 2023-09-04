import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { status: "uploaded" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      //TODO: API call to process image via model goes here
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;