"use client";

import { useState, useEffect } from "react";
import {
  UploadButton,
  UploadDropzone,
  useUploadThing,
} from "@/lib/uploadthing";

export default function UploadThing() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

 

  useEffect(() => {
    // Cleanup the preview URL when component unmounts or when imageUrl is set
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (files: File[]) => {
    if (files?.[0]) {
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  return (
    <main>
      <UploadButton
        endpoint={(routeRegistry) => routeRegistry.videoAndImage}
        onClientUploadComplete={(res) => {
          console.log(`onClientUploadComplete`, res);
          if (res[0]) {
            setImageUrl(res[0].url);
          }
          alert("Upload Completed");
        }}
        onUploadBegin={() => {
          console.log("upload begin");
        }}
        config={{ appendOnPaste: true, mode: "manual" }}
      />
      <UploadDropzone
        endpoint={(routeRegistry) => routeRegistry.videoAndImage}
        onUploadAborted={() => {
          alert("Upload Aborted");
        }}
        onClientUploadComplete={(res) => {
          console.log(`onClientUploadComplete`, res);
          if (res[0]) {
            setImageUrl(res[0].url);
          }
          alert("Upload Completed");
        }}
        onUploadBegin={() => {
          console.log("upload begin");
        }}
      />
    

      {/* Display the preview image */}
      {previewUrl && !imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Preview:</h3>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '300px' }} />
        </div>
      )}

      {/* Display the uploaded image */}
      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </main>
  );
}