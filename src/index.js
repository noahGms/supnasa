const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const setupDB = require("./database");
require("dotenv").config();

function main() {
  const server = express();
  setupDB();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(helmet());
  server.use(morgan("common"));

  server.get("/", (req, res) => {
    res.json({ message: "Entry point of SUPNASA api !" });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Express server listening on port ${port} !`);
  });
}
main();
