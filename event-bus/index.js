import bodyParser from "body-parser";
import express from "express";
import { randomBytes } from "crypto";
import axios from "axios";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/events", async (req, res) => {
  try {
    const event = req.body;
    console.log("Received event:", event);
    await axios.post("http://localhost:4000/events", event);
    res.send({ status: "OK" });
  } catch (error) {
    console.error("Error handling event:", error.message);
    res.status(500).send({
      success: false,
      message: "Error handling event",
    });
  }
});

app.listen(4005, () => {
  console.log("listening on port 4005");
});
