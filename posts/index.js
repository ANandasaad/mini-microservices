import bodyParser from "body-parser";
import express from "express";
import { randomBytes } from "crypto";
import axios from "axios";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const post = {};
app.get("/posts", (req, res) => {
  res.send(post);
});
app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  post[id] = {
    id,
    title,
  };
  try {
    await axios({
      method: "post",
      url: "http://event-bus-srv:4005/events",
      data: {
        type: "PostCreated",
        data: {
          id,
          title,
        },
      },
    });
    res.status(201).send({
      success: true,
      data: post[id],
    });
  } catch (error) {
    console.error("Error posting event:", error.message);
    res.status(500).send({
      success: false,
      message: "Error posting event",
    });
  }
});

app.post("/events", async (req, res) => {
  console.log(req.body);
  res.status(200).send({ success: true });
});
app.listen(4000, () => {
  console.log("v30");
  console.log("listening on 4000");
});
