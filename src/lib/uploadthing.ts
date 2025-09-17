import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// NOTE: we are not checking the auth here in this version.
export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("file url", file.ufsUrl);
    return { url: file.ufsUrl };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
