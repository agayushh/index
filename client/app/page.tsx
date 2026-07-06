"use client";

import React, { useState } from "react";
import { FileUpload } from "./components/fileUpload";
import { Chat } from "./components/chat";

const Page = () => {
  const [chatKey, setChatKey] = useState(0);

  const handleUploadSuccess = () => {
    setChatKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Upload Sidebar */}
      <section className="w-full md:w-[40vw] border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col justify-center">
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </section>

      {/* Chat / Preview Panel */}
      <section className="flex-1 min-h-[50vh] md:min-h-screen p-6 md:p-8 flex flex-col justify-center items-center relative overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]">
        <div className="w-full max-w-2xl h-full flex flex-col justify-center">
          <Chat key={chatKey} />
        </div>
      </section>
    </main>
  );
};

export default Page;


