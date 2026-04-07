import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./db/dbconn.js";
import userRouter from "./routes/userRouter.js";
import blogsRouter from "./routes/blogsRouter.js";
import { PORT } from "./config.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.use("/api/users", userRouter);
app.use("/api/blogs", blogsRouter);

await connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
