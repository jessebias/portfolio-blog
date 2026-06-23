import express from "express";
import cors from "cors";
import blogsRouter from "../routes/blogsRouter.js";
import authRouter from "../routes/authRouter.js";
import metaRouter from "../routes/metaRouter.js";
import contactRouter from "../routes/contactRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Server is running!");
});

app.use("/api/blogs", blogsRouter);
app.use("/api/auth", authRouter);
app.use("/api/meta", metaRouter);
app.use("/api/contact", contactRouter);

export default app;
