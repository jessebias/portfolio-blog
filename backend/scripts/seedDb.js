import mongoose from "mongoose";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import { MONGO_URI } from "../config.js";

await mongoose.connect(MONGO_URI);

const user = await User.create({
    name: "Terminal Author",
    email: "terminal@blog.com",
});

await Blog.create({
    title: "entry_001",
    content: "exploring the boundary of engineering and aesthetics.",
    user: user._id,
});

console.log("Database seeded");
process.exit();
