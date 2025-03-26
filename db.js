const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === "test" ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;
    if (!uri) throw new Error("MongoDB URI is not defined in environment variables");

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error(`Database Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
