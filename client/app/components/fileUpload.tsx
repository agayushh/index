"use client";
import { Upload, Check, Loader2, AlertCircle, FileText } from "lucide-react";
import * as React from "react";

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [status, setStatus] = React.useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileName, setFileName] = React.useState<string>("");

  const handleFileUpload = () => {
    if (status === "uploading") return;

    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");
    el.addEventListener("change", async (e: Event) => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) {
          setFileName(file.name);
          setStatus("uploading");
          try {
            const formData = new FormData();
            formData.append("pdf", file);
            const response = await fetch("http://localhost:8000/upload/pdf", {
              method: "POST",
              body: formData,
            });
            if (!response.ok) throw new Error("Upload failed");
            console.log("file uploaded");
            setStatus("success");
            onUploadSuccess?.();
          } catch (err) {
            console.error(err);
            setStatus("error");
          }
        }
      }
    });
    el.click();
  };

  const resetUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus("idle");
    setFileName("");
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full p-8 bg-zinc-950 text-zinc-100 font-sans">
      <div
        onClick={status === "success" ? undefined : handleFileUpload}
        className={`w-full max-w-md aspect-square rounded-2xl border-2 border-dashed flex flex-col justify-center items-center p-6 text-center transition-all duration-300 relative overflow-hidden group ${
          status === "success"
            ? "border-emerald-500/50 bg-zinc-900/40 shadow-[0_0_30px_rgba(16,185,129,0.05)] cursor-default"
            : status === "uploading"
            ? "border-zinc-800 bg-zinc-900/20 cursor-wait"
            : status === "error"
            ? "border-rose-500/50 bg-zinc-900/40 cursor-pointer"
            : "border-zinc-800 bg-zinc-900/50 hover:border-violet-500/50 hover:bg-zinc-900/80 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] cursor-pointer"
        }`}
      >
        {/* Background glow animation */}
        {status !== "success" && status !== "error" && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}

        <div className="flex flex-col items-center space-y-4 relative z-10 w-full px-4">
          {status === "idle" && (
            <>
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
                Supports PDF documents
              </div>
            </>
          )}

          {status === "uploading" && (
            <>
              <div className="p-4 bg-zinc-850/80 rounded-2xl text-violet-400 shadow-lg border border-zinc-700/50">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <p className="font-semibold text-zinc-200 truncate max-w-70">
                  Uploading {fileName}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Processing document pipelines...
                </p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl shadow-lg border border-emerald-500/20">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                  Upload Complete
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-2 bg-zinc-950/80 border border-zinc-800/80 rounded-lg py-1.5 px-3 max-w-70 mx-auto">
                  <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <p className="text-xs text-zinc-400 truncate">{fileName}</p>
                </div>
              </div>
              <button
                onClick={resetUpload}
                className="mt-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium px-4 py-2 rounded-xl transition-all cursor-pointer border border-zinc-700"
              >
                Upload another file
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="p-4 bg-rose-500/10 text-rose-400 rounded-2xl shadow-lg border border-rose-500/20">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold text-rose-400">Upload Failed</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Something went wrong. Click to retry.
                </p>
              </div>
              <button
                onClick={resetUpload}
                className="mt-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium px-4 py-2 rounded-xl transition-all cursor-pointer border border-zinc-700"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

