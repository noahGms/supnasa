const server = require("./src/server");
const setupDB = require("./src/config/database");

require("dotenv").config();
function start() {
  setupDB();

  const port = process.env.PORT || 1234;
  server.listen(port, () => {
    console.log(`express server running on port ${port}`);
  });
}

start();