const mongoose = require("mongoose");

const connect = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // For Local Connection
  // const url = `mongodb://${process.env.DATABSE_HOST}:${process.env.DATABSE_PORT}/${process.env.DATABSE_COLLECT}`;

  // For Production Connection
  const url = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.dkkbuub.mongodb.net/${process.env.DATABSE_COLLECT}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(url, options);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

module.exports = connect;
