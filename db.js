const mongoose = require("mongoose");
const logger = require("./logs/appLogger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info("MongoDB Connected...");
  } catch (error) {
    logger.error(`Database Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
