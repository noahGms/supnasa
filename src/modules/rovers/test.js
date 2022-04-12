const { server } = require("../../../index");
const request = require("supertest");
const { expect } = require("chai");
const { getTestCookie, getTestRover, getTestRover2 } = require("../../../test");

describe("GET: /api/rovers", () => {
  it("should return all rovers", (done) => {
    request(server)
      .get("/api/rovers")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.a("array");
        expect(res.body.data.length).to.not.equal(0);
        done();
      });
  });

  it("should return only one element", (done) => {
    request(server)
      .get("/api/rovers?limit=1")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.a("array");
        expect(res.body.data.length).to.equal(1);
        done();
      });
  });

  it("should return Rover 2 at first position", (done) => {
    request(server)
      .get("/api/rovers?name=desc")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data[0].name).to.equal("Rover 2");
        done();
      });
  });

  it("should return Rover 2 at first position", (done) => {
    request(server)
      .get("/api/rovers?date=desc")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data[0].name).to.equal("Rover 2");
        done();
      });
  });
});

describe("GET: /api/rovers/:id", () => {
  it("should return rover data", (done) => {
    request(server)
      .get(`/api/rovers/${getTestRover()._id.toString()}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.a("object");
        expect(res.body.data.name).to.equal("Rover 1");
        done();
      });
  });

  it("should return rover not found", (done) => {
    request(server)
      .get(`/api/rovers/${getTestRover()._id.toString().slice(0, -1)}2`)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal("Rover not found");
        done();
      });
  });
});

describe("POST: /api/rovers", () => {
  it("should return missing name", (done) => {
    request(server)
      .post("/api/rovers")
      .set("Cookie", getTestCookie())
      .send({
        launchDate: "2020-01-01",
        constructionDate: "2020-01-01",
        manufacturer: "NASA",
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal('"name" is required');
        done();
      });
  });

  it("should return missing launchDate", (done) => {
    request(server)
      .post("/api/rovers")
      .set("Cookie", getTestCookie())
      .send({
        name: "New rover",
        constructionDate: "2020-01-01",
        manufacturer: "NASA",
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal('"launchDate" is required');
        done();
      });
  });

  it("should return missing constructionDate", (done) => {
    request(server)
      .post("/api/rovers")
      .set("Cookie", getTestCookie())
      .send({
        name: "New rover",
        launchDate: "2020-01-01",
        manufacturer: "NASA",
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal('"constructionDate" is required');
        done();
      });
  });

  it("should return missing manufacturer", (done) => {
    request(server)
      .post("/api/rovers")
      .set("Cookie", getTestCookie())
      .send({
        name: "New rover",
        launchDate: "2020-01-01",
        constructionDate: "2020-01-01",
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal('"manufacturer" is required');
        done();
      });
  });

  it("should return name already exists", (done) => {
    request(server)
      .post("/api/rovers")
      .set("Cookie", getTestCookie())
      .send({
        name: "Rover 1",
        launchDate: "2020-01-01",
        constructionDate: "2020-01-01",
        manufacturer: "NASA",
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal("Already used: Rover 1 (name)");
        done();
      });
  });

  it("should return 401 if user is not authenticated", (done) => {
    request(server)
      .post("/api/rovers")
      .send({
        name: "Rover 1",
        launchDate: "2020-01-01",
        constructionDate: "2020-01-01",
        manufacturer: "NASA",
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
      .post("/api/rovers")
      .set("Cookie", getTestCookie())
      .send({
        name: "New rover",
        launchDate: "2020-01-01",
        constructionDate: "2020-01-01",
        manufacturer: "NASA",
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("Rover created successfully");
        done();
      });
  });
});

describe("PUT: /api/rovers/:id", () => {
  it("should return rover not found", (done) => {
    request(server)
      .put(`/api/rovers/${getTestRover()._id.toString().slice(0, -1)}2`)
      .set("Cookie", getTestCookie())
      .send({
        name: "Updated",
        launchDate: "2020-01-01",
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal("Rover not found");
        done();
      });
  });

  it("should return name already exists", (done) => {
    request(server)
      .put(`/api/rovers/${getTestRover()._id.toString()}`)
      .set("Cookie", getTestCookie())
      .send({
        name: getTestRover2().name,
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal(
          `Already used: ${getTestRover2().name} (name)`
        );
        done();
      });
  });

  it("should return 401 if user is not authenticated", (done) => {
    request(server)
      .put(`/api/rovers/${getTestRover()._id.toString()}`)
      .send({
        name: "Updated",
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
      .put(`/api/rovers/${getTestRover()._id.toString()}`)
      .set("Cookie", getTestCookie())
      .send({
        name: "Updated",
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("Rover updated successfully");
        done();
      });
  });
});

describe("DELETE: /api/rovers/:id", () => {
  it("should return rover not found", (done) => {
    request(server)
      .delete(`/api/rovers/${getTestRover()._id.toString().slice(0, -1)}2`)
      .set("Cookie", getTestCookie())
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal("Rover not found");
        done();
      });
  });

  it("should return 401 if user is not authenticated", (done) => {
    request(server)
      .delete(`/api/rovers/${getTestRover()._id.toString()}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal("No token provided");
        done();
      });
  });

  it("should return error because user is not admin", (done) => {
    request(server)
      .delete(`/api/rovers/${getTestRover()._id.toString()}`)
      .set("Cookie", getTestCookie())
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal("You can't delete this rover");
        done();
      });
  });

  it("should return success", (done) => {
    request(server)
      .delete(`/api/rovers/${getTestRover()._id.toString()}`)
      .set("Cookie", getTestCookie())
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("Rover deleted successfully");
        done();
      });
  });
});
