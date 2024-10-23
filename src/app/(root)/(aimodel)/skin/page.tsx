"use client";
import CardSkeleton from "@/components/ui/card-skeleton";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";

export default function SkinModelPage() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="flex h-screen items-center justify-center pt-[104px]">
      <CardSkeleton className="mx-auto min-h-96 w-full max-w-4xl">
        <FileUpload onChange={handleFileUpload} />
      </CardSkeleton>
    </div>
  );
}
