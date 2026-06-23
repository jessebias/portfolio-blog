import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./db/dbconn.js";
import blogsRouter from "./routes/blogsRouter.js";
import authRouter from "./routes/authRouter.js";
import metaRouter from "./routes/metaRouter.js";
import contactRouter from "./routes/contactRouter.js";
import { PORT } from "./config.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (_req, res) => {
    res.send("Server is running!");
});

app.use("/api/blogs", blogsRouter);
app.use("/api/auth", authRouter);
app.use("/api/meta", metaRouter);
app.use("/api/contact", contactRouter);

await connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
