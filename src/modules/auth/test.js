const { server } = require("../../../index");
const request = require("supertest");
const { expect } = require("chai");
const { setTestCookie, getTestCookie } = require("../../../test");

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

        setTestCookie(res.headers["set-cookie"].pop().split(";")[0]);

        done();
      });
  });
});

describe("GET: /api/auth/whoami", () => {
  it("should return authenticated user data", (done) => {
    request(server)
      .get("/api/auth/whoami")
      .set("Cookie", getTestCookie())
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
