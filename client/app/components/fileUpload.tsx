"use client";
import { Upload } from "lucide-react";
import * as React from "react";

export const FileUpload: React.FC = () => {
  const handleFileUpload = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");
    el.addEventListener("change", async (e: Event) => {
      if (el.files && el.files.length > 0) {
        // console.log(el.files.item(0))
        const file = el.files.item(0);
        if (file) {
          const formData = new FormData();
          formData.append("pdf", file);
          await fetch("http://localhost:8000/upload/pdf", {
            method: "POST",
            body: formData,
          });
          console.log("file uploaded");
        }
      }
    });
    el.click();
  };
  return (
    <div className="flex flex-col justify-center items-center h-full w-full p-8 bg-zinc-950 text-zinc-100 font-sans">
      <div
        onClick={handleFileUpload}
        className="w-full max-w-md aspect-square rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 hover:border-violet-500/50 hover:bg-zinc-900/80 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] flex flex-col justify-center items-center p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group"
      >
        {/* Background glow animation */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className="p-4 bg-zinc-850/80 rounded-2xl text-violet-400 group-hover:scale-110 group-hover:text-violet-300 transition-all duration-300 shadow-lg border border-zinc-700/50">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="font-semibold text-zinc-200">Drag & drop your file</p>
            <p className="text-xs text-zinc-500 mt-1">
              or click to browse from device
            </p>
          </div>
          <div className="text-[10px] text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            Supports any document, PDF or image
          </div>
        </div>
      </div>
    </div>
  );
};
