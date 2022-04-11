const { db, server } = require("../index");
const User = require("../src/modules/users/model");
const request = require("supertest");
const { expect } = require("chai");

let cookie;
let user;
let user2;

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

describe("Auth", () => {
  describe("POST: /api/auth/login", () => {
    it("should return missing email or password", (done) => {
      request(server)
        .post("/api/auth/login")
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("Missing email or password");
          done();
        });
    });

    it("should return invalid email", (done) => {
      request(server)
        .post("/api/auth/login")
        .send({
          email: "bademail@gmail.com",
          password: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("Invalid email or password");
          done();
        });
    });

    it("should return invalid password", (done) => {
      request(server)
        .post("/api/auth/login")
        .send({
          email: "john.doe@example.com",
          password: "badpassword",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("Invalid email or password");
          done();
        });
    });

    it("should return login successful", (done) => {
      request(server)
        .post("/api/auth/login")
        .send({
          email: "john.doe@example.com",
          password: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.be.a("string");
          expect(res.body.message).to.equal("Login successful");

          cookie = res.headers["set-cookie"].pop().split(";")[0];

          done();
        });
    });
  });

  describe("GET: /api/auth/whoami", () => {
    it("should return authenticated user data", (done) => {
      request(server)
        .get("/api/auth/whoami")
        .set("Cookie", cookie)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.a("object");
          expect(res.body.data.email).to.equal("john.doe@example.com");
          expect(res.body.data.pseudo).to.equal("JohnDoe");
          done();
        });
    });

    it("should return 401 if user is not authenticated", (done) => {
      request(server)
        .get("/api/auth/whoami")
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("No token provided");
          done();
        });
    });
  });
});

describe("Users", () => {
  describe("GET: /api/users", () => {
    it("should return all users", (done) => {
      request(server)
        .get("/api/users")
        .set("Cookie", cookie)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.a("array");
          expect(res.body.data.length).to.not.equal(0);
          done();
        });
    });

    it("should return 401 if user is not authenticated", (done) => {
      request(server)
        .get("/api/users")
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("No token provided");
          done();
        });
    });
  });

  describe("GET: /api/users/:id", () => {
    it("should return user data", (done) => {
      request(server)
        .get(`/api/users/${user._id.toString()}`)
        .set("Cookie", cookie)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.a("object");
          expect(res.body.data.email).to.equal("john.doe@example.com");
          expect(res.body.data.pseudo).to.equal("JohnDoe");
          done();
        });
    });

    it("should return 401 if user is not authenticated", (done) => {
      request(server)
        .get(`/api/users/${user._id.toString()}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("No token provided");
          done();
        });
    });
  });

  describe("POST: /api/users", () => {
    it("should return missing email", (done) => {
      request(server)
        .post("/api/users")
        .send({
          pseudo: "Test",
          password: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal('"email" is required');
          done();
        });
    });

    it("should return missing pseudo", (done) => {
      request(server)
        .post("/api/users")
        .send({
          email: "email@example.com",
          password: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal('"pseudo" is required');
          done();
        });
    });

    it("should return missing password", (done) => {
      request(server)
        .post("/api/users")
        .send({
          email: "email@example.com",
          pseudo: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal('"password" is required');
          done();
        });
    });

    it("should return email must be a valid email", (done) => {
      request(server)
        .post("/api/users")
        .send({
          email: "email",
          pseudo: "123456",
          password: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal('"email" must be a valid email');
          done();
        });
    });

    it("should return email already exist", (done) => {
      request(server)
        .post("/api/users")
        .send({
          email: "john.doe@example.com",
          pseudo: "123456",
          password: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal(
            `Email is already taken ${user.email} (email)`
          );
          done();
        });
    });

    it("should return pseudo already exist", (done) => {
      request(server)
        .post("/api/users")
        .send({
          email: "john.doe2@example.com",
          pseudo: "JohnDoe",
          password: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal(
            `Pseudo is already taken ${user.pseudo} (pseudo)`
          );
          done();
        });
    });

    it("should return success", (done) => {
      request(server)
        .post("/api/users")
        .send({
          email: "newUser@example.com",
          pseudo: "NewUser",
          password: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.be.a("string");
          expect(res.body.message).to.equal("User created successfully");
          done();
        });
    });
  });

  describe("PUT: /api/users/:id", () => {
    it("should return user not found", (done) => {
      request(server)
        .put(`/api/users/${user._id.toString().slice(0, -1)}2`)
        .set("Cookie", cookie)
        .send({
          pseudo: "Test",
          password: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("User not found");
          done();
        });
    });

    it("should return cannot update this user", (done) => {
      request(server)
        .put(`/api/users/${user2._id.toString()}`)
        .set("Cookie", cookie)
        .send({
          pseudo: "Test",
          password: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("You can't update this user");
          done();
        });
    });

    it("should return email already exist", (done) => {
      request(server)
        .put(`/api/users/${user._id.toString()}`)
        .set("Cookie", cookie)
        .send({
          email: "newUser@example.com",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal(
            `Email is already taken newUser@example.com (email)`
          );
          done();
        });
    });

    it("should return pseudo already exist", (done) => {
      request(server)
        .put(`/api/users/${user._id.toString()}`)
        .set("Cookie", cookie)
        .send({
          pseudo: "NewUser",
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal(
            `Pseudo is already taken NewUser (pseudo)`
          );
          done();
        });
    });

    it("should return 401 if user is not authenticated", (done) => {
      request(server)
        .put(`/api/users/${user._id.toString()}`)
        .send({
          pseudo: "Test",
          password: "123456",
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("No token provided");
          done();
        });
    });

    it("should return success", (done) => {
      request(server)
        .put(`/api/users/${user._id.toString()}`)
        .set("Cookie", cookie)
        .send({
          pseudo: "updated",
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.be.a("string");
          expect(res.body.message).to.equal("User updated successfully");
          done();
        });
    });
  });

  describe("DELETE: /api/users/:id", () => {
    it("should return user not found", (done) => {
      request(server)
        .delete(`/api/users/${user._id.toString().slice(0, -1)}2`)
        .set("Cookie", cookie)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("User not found");
          done();
        });
    });

    it("should return cannot delete this user", (done) => {
      request(server)
        .delete(`/api/users/${user2._id.toString()}`)
        .set("Cookie", cookie)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("You can't delete this user");
          done();
        });
    });

    it("should return 401 if user is not authenticated", (done) => {
      request(server)
        .delete(`/api/users/${user._id.toString()}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.a("string");
          expect(res.body.error).to.equal("No token provided");
          done();
        });
    });

    it("should return success", (done) => {
      request(server)
        .delete(`/api/users/${user._id.toString()}`)
        .set("Cookie", cookie)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.be.a("string");
          expect(res.body.message).to.equal("User deleted successfully");
          done();
        });
    });
  });
});
