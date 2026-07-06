if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch (e) {
    // Ignore if file not found
  }
}

import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const queue = new Queue("file-upload-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    status: "all good",
  });
});

app.post("/upload/pdf", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  queue.add(
    "file-ready",
    JSON.stringify({
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path,
    }),
  );
  return res.json({
    message: "uploaded",
  });
});

app.get("/chat", async (req, res) => {
  const userQuery = req.query.message;
  if (typeof userQuery !== "string" || !userQuery) {
    return res.status(400).json({ error: "message parameter is required and must be a string" });
  }
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GEMINI_API_KEY,
  });
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "google-testing-3072-02",
    },
  );
  const ret = vectorStore.asRetriever({
    k: 2,
  });
  const result = await ret.invoke(userQuery);

  const SYSTEM_PROMPT = `
  You are a helpful AI assitant who answers the user query based on the available context from the pdf file 
  Context: 
  ${JSON.stringify(result)}
  `;

  const chatResult = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userQuery,
    config: {
      systemInstruction: SYSTEM_PROMPT,
    },
  });
  return res.json({ result: chatResult.text, docs: result });
});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
