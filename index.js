const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer"); // require multer at the top
const upload = multer({ storage: multer.memoryStorage() }); // define multer upload
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://ridwanshuvo38:ridwanshuvo38@clusterresearch.nrhvslo.mongodb.net/research_portal?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let ResearchCollection;

async function run() {
  try {
    await client.connect();
    ResearchCollection = client.db("research_portal").collection("researchpapers");

    // Confirm successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Routes below

    // GET all papers
    app.get("/api/papers", async (req, res) => {
      try {
        const papers = await ResearchCollection.find({}).toArray();
        res.send(papers);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch papers", error: err });
      }
    });

    // Update paper status
    app.put("/api/papers/:id/status", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      try {
        const result = await ResearchCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } }
        );

        if (result.modifiedCount > 0) {
          res.send({ message: "Status updated successfully" });
        } else {
          res.status(404).send({ message: "Paper not found or status unchanged" });
        }
      } catch (err) {
        res.status(500).send({ message: "Failed to update status", error: err });
      }
    });

    // Submit new paper with optional file upload
    app.post("/api/submit", upload.single("file"), async (req, res) => {
      const paper = req.body;

      // If you want to handle the file upload and store a link, do it here
      // e.g. upload file to cloudinary or store in DB
      // paper.pdfUrl = req.file ? 'your_cloud_storage_url' : null;

      try {
        const result = await ResearchCollection.insertOne(paper);
        res.status(201).send({ message: "Paper submitted successfully", id: result.insertedId });
      } catch (err) {
        res.status(500).send({ message: "Failed to submit paper", error: err });
      }
    });

  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

run();

app.get("/", (req, res) => {
  res.send("Research Portal is running");
});

app.listen(port, () => {
  console.log("Research Portal server is running on port", port);
});
