const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;
require("dotenv").config();

app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Create report schema
const reportSchema = new mongoose.Schema({
  url: String,
  description: String,
  timestamp: { type: Date, default: Date.now },
  whoisInfo: Object,
});

// Create Report model
const Report = mongoose.model("Report", reportSchema);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.post("/report", async (req, res) => {
  try {
    const { url, description } = req.body;
    const report = new Report({ url, description });
    const domainName = url.replace(/^(https?:\/\/)?(www\.)?/, "");
    const whoisResponse = await fetch(
      `https://api.apilayer.com/whois/query?domain=${domainName}`,
      {
        method: "GET",
        redirect: "follow",
        headers: { apikey: process.env.APILAYER_KEY },
      }
    );
    const whoisData = await whoisResponse.json();
    report.whoisInfo = whoisData.result;
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: `Error creating report ${error}` });
  }
});

app.get("/reports", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reports" });
  }
});
