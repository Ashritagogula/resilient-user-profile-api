const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Trying MongoDB connection...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:");
    console.error(error);

    process.exit(1);
  }
};

module.exports = connectDB;