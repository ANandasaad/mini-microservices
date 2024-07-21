import bodyParser from "body-parser";
import express from "express";
import { randomBytes } from "crypto";
import axios from "axios";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const events = [];
app.post("/events", async (req, res) => {
  try {
    const event = req.body;
    events.push(event);
    console.log("Received event:", event);
    await axios.post("http://localhost:4000/events", event);
    await axios.post("http://localhost:4001/events", event);
    await axios.post("http://localhost:4002/events", event);
    await axios.post("http://localhost:4003/events", event);
    res.send({ status: "OK" });
  } catch (error) {
    console.error("Error handling event:", error.message);
    res.status(500).send({
      success: false,
      message: "Error handling event",
    });
  }
});

app.get("/events", async (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("listening on port 4005");
});
