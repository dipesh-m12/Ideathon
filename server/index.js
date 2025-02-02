const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors())

// Connect to MongoDB
mongoose.connect('mongodb+srv://dev:applejuice123@cluster0.2p8mb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Create report schema
const reportSchema = new mongoose.Schema({
  url: String,
  description: String,
  timestamp: { type: Date, default: Date.now }
});

// Create Report model
const Report = mongoose.model('Report', reportSchema);

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
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: "Error creating report" });
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