const { db, server } = require("../index");
const User = require("../src/modules/users/model");
const Rover = require("../src/modules/rovers/model");

let cookie;
let user;
let user2;
let rover;
let rover2;

function getTestCookie() {
  return cookie;
}

function setTestCookie(newCookie) {
  cookie = newCookie;
}

function getTestUser() {
  return user;
}

function getTestUser2() {
  return user2;
}

function getTestRover() {
  return rover;
}

function getTestRover2() {
  return rover2;
}

module.exports = {
  getTestCookie,
  setTestCookie,
  getTestUser,
  getTestUser2,
  getTestRover,
  getTestRover2,
};

function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

describe("hooks", function () {
  before(async function () {
    await db.collections.users.drop();
    user = await User.create({
      pseudo: "JohnDoe",
      email: "john.doe@example.com",
      password: "123456",
    });

    user2 = await User.create({
      pseudo: "AnotherUser",
      email: "another.user@example.com",
      password: "123456",
    });

    await db.collections.rovers.drop();

    rover = await Rover.create({
      name: "Rover 1",
      launchDate: new Date("2012-08-06"),
      constructionDate: new Date("2012-08-06"),
      manufacturer: "NASA",
    });

    rover2 = await Rover.create({
      name: "Rover 2",
      launchDate: new Date("2019-08-06"),
      constructionDate: new Date("2019-08-06"),
      manufacturer: "IDK",
    });
  });

  importTest("Auth", "../src/modules/auth/test");
  importTest("Rovers", "../src/modules/rovers/test");
  importTest("Users", "../src/modules/users/test");
});
