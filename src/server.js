const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const apiRoutes = require("./routes");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(helmet());
server.use(morgan("common"));

server.get("/", (req, res) => {
  res.json({ message: "Entry point of SUPNASA api !" });
});

server.use('/api', apiRoutes);

module.exports = server;
