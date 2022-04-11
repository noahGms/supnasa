const { db, server } = require("../index");
const User = require("../src/modules/users/model");
const request = require("supertest");
const { expect } = require("chai");

let cookie;
let user;
let user2;

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

db.collections.users.drop(async () => {
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
});

module.exports = { getTestCookie, setTestCookie, getTestUser, getTestUser2 };

function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

importTest("Auth", "../src/modules/auth/test");
importTest("Auth", "../src/modules/users/test");
