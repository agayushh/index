import express from "express";
import cors from "cors";
import multer from "multer";

const upload = multer();
const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    status: "all good",
  });
});

app.post("/upload/pdf", upload.single("pdf"), (req, res) => {});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
