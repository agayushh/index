import React from "react"
import { FileUpload } from "./components/fileUpload"

const Page = () => {
  return (
    <main className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Upload Sidebar */}
      <section className="w-full md:w-[40vw] border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col justify-center">
        <FileUpload />
      </section>

      {/* Preview Panel */}
      <section className="flex-1 min-h-[50vh] md:min-h-screen p-8 flex flex-col justify-center items-center relative overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Viewer ready</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            File Processing System
          </h1>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Upload your documents, images, or PDFs in the sidebar to preview and process them instantly using secure pipelines.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Page

