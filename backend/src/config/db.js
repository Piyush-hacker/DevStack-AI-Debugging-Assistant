import mongoose from "mongoose";

const connectDB = async () => {
  // TODO: Add your real MongoDB connection string in backend/.env.
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

export default connectDB;
