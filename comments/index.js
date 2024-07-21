import bodyParser from "body-parser";
import express from "express";
import { randomBytes } from "crypto";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const commentByPostId = {};
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentByPostId[req.params.id] || []);
});
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: "pending" });
  commentByPostId[req.params.id] = comments;

  try {
    await axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });

    res.status(201).send({
      success: true,
      data: commentByPostId[req.params.id],
    });
  } catch (error) {
    console.error("Error creating comment", error.message);
    res.status(500).send({
      success: false,
      message: "Error posting event",
    });
  }
});
app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }
  res.send({});
});
app.listen(4001, () => {
  console.log("listening on 4001");
});
