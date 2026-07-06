if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch (e) {
    // Ignore if file not found
  }
}

import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantClient } from "@qdrant/js-client-rest";

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log("job", job.data);
    const data = JSON.parse(job.data);
    const load = new PDFLoader(data.path);
    const docs = await load.load();

    console.log(docs[0]?.pageContent);
    console.log(docs[0]?.metadata);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 0,
    });
    const client = new QdrantClient({ url: "http://localhost:6333" });
    const texts = await textSplitter.splitDocuments(docs);

    console.log(texts[0]?.pageContent);
    console.log(texts[1]?.pageContent);
    console.log(texts);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey: process.env.GEMINI_API_KEY,
    });
    const collections = await client.getCollections();
    const hasCollection = collections.collections.some(
      (c) => c.name === "google-testing-3072-02",
    );
    if (!hasCollection) {
      await client.createCollection("google-testing-3072-02", {
        vectors: {
          size: 3072,
          distance: "Cosine",
        },
      });
    }

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: "http://localhost:6333",
        collectionName: "google-testing-3072-02",
      },
    );

    const batchSize = 50;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      await vectorStore.addDocuments(batch);
      console.log(`Uploaded batch ${i / batchSize + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log("all docs are added to vector store");
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

worker.on("failed", (job, err) => {
  console.log("job failed:", err);
});
