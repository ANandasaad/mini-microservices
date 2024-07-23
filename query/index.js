import express from "express";
import cors from "cors";
import axios from "axios";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const posts = {};

const handleEvents = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];

    if (post) {
      post.comments.push({ id, content, status });
    } else {
      console.error(`Post with ID ${postId} not found.`);
    }
  }
  if (type === "CommentUpdated") {
    const { id, content, status, postId } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
};
app.get("/posts", (req, res) => {
  res.send({ posts });
});
app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log(req.body);
  handleEvents(type, data);
  res.send({});
});
app.listen(4002, async () => {
  console.log("listening on 4002");
  const res = await axios.get("http://event-bus-srv:4005/events");
  console.log(res);
  for (let event of res.data) {
    console.log("Processing event:", event.type);
    handleEvents(event.type, event.data);
  }
});
