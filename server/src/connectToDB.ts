import mongoose from "mongoose";

const connectToDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_DB_URI as string;
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    if (error instanceof Error)
      console.log("Error connecting to MongoDB", error.message);
    else console.log("Unknown error connecting to MongoDB");
  }
};

export default connectToDB;
