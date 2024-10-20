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
    <div className="h-screen pt-[104px] flex items-center justify-center">
      <CardSkeleton className="w-full max-w-4xl mx-auto min-h-96">
        <FileUpload onChange={handleFileUpload} />
      </CardSkeleton>
    </div>
  )
}