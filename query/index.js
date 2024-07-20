import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const posts = {};
app.get("/posts", (req, res) => {
  res.send({ posts });
});
app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log(req.body);

  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId } = data;

    const post = posts[postId];

    if (post) {
      post.comments.push({ id, content });
    } else {
      console.error(`Post with ID ${postId} not found.`);
    }
  }

  res.send({});
});
app.listen(4002, () => {
  console.log("listening on 4002");
});
