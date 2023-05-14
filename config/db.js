const mongoose = require("mongoose");

const connect = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  let url;
  // For Production Connection
  if (process.env.NODE_ENV?.trim() !== "development") {
    // url = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.dkkbuub.mongodb.net/${process.env.DATABSE_COLLECT}?retryWrites=true&w=majority`;

    url = `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABSE_HOST}:${process.env.DATABSE_PORT}`;
    // url = `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABSE_HOST}:${process.env.DATABSE_PORT}/${process.env.DATABSE_COLLECT}`;
  } else {
    // For Local Connection

    // url = `mongodb://${process.env.DATABSE_HOST}:${process.env.DATABSE_PORT}/${process.env.DATABSE_COLLECT}`;
    url = `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABSE_HOST}:${process.env.DATABSE_PORT}`;
  }

  console.log(url);

  try {
    await mongoose.connect(url, options);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

module.exports = connect;
