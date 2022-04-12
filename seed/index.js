const setupDB = require("../src/config/database");
const User = require("../src/modules/users/model");
const Rover = require("../src/modules/rovers/model");
const Mission = require("../src/modules/missions/model");

const usersJson = require("./data/users.json");
const roversJson = require("./data/rovers.json");
const missionsJson = require("./data/missions.json");

require("dotenv").config();

async function seedUsers(users) {
  const temp = [];
  for (const user of users) {
    const tempUser = await User.create(user);
    temp.push(tempUser);
    console.log(`${user.pseudo} created`);
  }
  return temp;
}

async function seedRovers(rovers) {
  const temp = [];
  for (const rover of rovers) {
    const tempRover = await Rover.create(rover);
    temp.push(tempRover);
    console.log(`${rover.name} created`);
  }
  return temp;
}

async function seedMissions(missions, users, rovers) {
  const temp = [];

  for (const [i, mission] of missions.entries()) {
    const user = users[i];
    const rover = rovers[i];
    const tempMission = await Mission.create({
      ...mission,
      rovers: [rover._id],
      author: user._id,
    });
    temp.push(tempMission);
    console.log(`${mission.country} created`);
  }
  return temp;
}

function seedDB() {
  const db = setupDB();

  db.once("open", async () => {
    console.log("seeding started");

    await User.deleteMany({});
    await Rover.deleteMany({});
    await Mission.deleteMany({});

    const usersCreated = await seedUsers(usersJson);
    const roversCreated = await seedRovers(roversJson);
    await seedMissions(missionsJson, usersCreated, roversCreated);

    db.close(() => {
      console.log("seeding finished");
    });
  });
}

seedDB();
