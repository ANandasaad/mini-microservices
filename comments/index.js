import bodyParser from "body-parser";
import express from "express";
import { randomBytes } from "crypto";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const commentByPostId = {};
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentByPostId[req.params.id] || []);
});
app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentByPostId[req.params.id] || [];
  comments.push({ id: commentId, content });
  commentByPostId[req.params.id] = comments;
  res.status(201).send({
    success: true,
    data: commentByPostId[req.params.id],
  });
});
app.listen(4001, () => {
  console.log("listening on 4001");
});
