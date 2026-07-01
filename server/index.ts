import express from "express";
import cors from "cors";
import multer from "multer";

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
  return res.json({
    message: "uploaded",
  });
});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
