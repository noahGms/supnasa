const mongoose = require("mongoose");

function setupDB() {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "mongoose connection error:"));
  db.once("open", () => {
    console.log("mongoose connection etablished");
  });
}

module.exports = setupDB;
