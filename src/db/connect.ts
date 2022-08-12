import mongoose from "mongoose";

export const connectDB = (url: any) => mongoose.connect(url);
