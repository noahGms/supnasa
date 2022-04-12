const { db, server } = require("../index");
const User = require("../src/modules/users/model");
const Rover = require("../src/modules/rovers/model");
const Mission = require("../src/modules/missions/model");

let cookie;
let user;
let user2;
let rover;
let rover2;
let mission;
let mission2;

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

function getTestMission() {
  return mission;
}

function getTestMission2() {
  return mission2;
}

module.exports = {
  getTestCookie,
  setTestCookie,
  getTestUser,
  getTestUser2,
  getTestRover,
  getTestRover2,
  getTestMission,
  getTestMission2,
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

    await db.collections.missions.drop();

    mission = await Mission.create({
      country: "France",
      startDate: new Date("2012-08-06"),
      endDate: new Date("2012-08-07"),
      rovers: [rover._id],
      author: user._id,
    });

    mission2 = await Mission.create({
      country: "United States",
      startDate: new Date("2019-08-06"),
      endDate: new Date("2019-08-07"),
      rovers: [rover2._id],
      author: user2._id,
    });
  });

  importTest("Auth", "../src/modules/auth/test");
  importTest("Rovers", "../src/modules/rovers/test");
  importTest("Missions", "../src/modules/missions/test");
  importTest("Users", "../src/modules/users/test");
});
