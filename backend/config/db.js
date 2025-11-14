const mongoose = require("mongoose");

const mongo_url = process.env.MONGO_URI;

// Validate environment variable
if (!mongo_url) {
  throw new Error(" MONGO_URI is not defined in environment variables.");
}

async function connectDb() {
  try {
    // Recommended options for production
    await mongoose.connect(mongo_url);

    console.log("✅ Database connected successfully!");

  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);

 
  }
}

module.exports = connectDb;
