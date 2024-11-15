"use client";

import { useState, useEffect } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function UploadThing() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col gap-4">
     

      {/* Custom styled Upload Dropzone */}
      <UploadDropzone
        endpoint="videoAndImage"
        onClientUploadComplete={(res) => {
          if (res?.[0]) setImageUrl(res[0].url);
          toast.success("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          console.error(`ERROR! ${error.message}`);
        }}
        onUploadBegin={() => {
          console.log("upload begin");
        }}
        appearance={{
          container: "mt-4 border-2 border-dashed border-slate-300 rounded-lg h-32",
          label: "text-slate-500",
          allowedContent: "text-slate-500 text-sm",
          uploadIcon: "text-slate-400",
          button: "bg-blue-500 hover:bg-blue-600 text-white ut-uploading:bg-blue-500/50 px-6",
        }}
        content={{
          label: "Drop your image here or click to browse",
          allowedContent: "Images up to 4MB",
          button({ ready, isUploading }) {
            if (!ready) return "Getting ready...";
            if (isUploading) return "Uploading...";
            return "Upload";
          },
        }}
      />

       {/* Custom styled Upload Button */}
       <UploadButton
        endpoint="videoAndImage"
        onClientUploadComplete={(res) => {
          if (res?.[0]) setImageUrl(res[0].url);
          alert("Upload Completed");
        }}
        onUploadBegin={() => {
          console.log("upload begin");
        }}
        appearance={{
          button: "bg-blue-500 hover:bg-blue-600 text-white px-6",
          allowedContent: "text-slate-500 text-sm",
        }}
      />

      {/* Preview Image */}
      {imageUrl && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-900">Uploaded Image:</h3>
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="mt-2 max-w-[300px] rounded-lg border border-slate-200" 
          />
        </div>
      )}
    </div>
  );
}