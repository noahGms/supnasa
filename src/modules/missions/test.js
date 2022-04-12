const { server } = require("../../../index");
const request = require("supertest");
const { expect } = require("chai");
const {
  getTestMission,
  getTestMission2,
  getTestCookie,
  getTestRover,
  getTestRover2,
} = require("../../../test");

describe("GET: /api/missions", () => {
  it("should return all missions", (done) => {
    request(server)
      .get("/api/missions")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.a("array");
        expect(res.body.data.length).to.not.equal(0);
        done();
      });
  });

  it("should return Mission 2 at first position", (done) => {
    request(server)
      .get("/api/missions?startDate=desc")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data[0].country).to.equal("United States");
        done();
      });
  });

  it("should return Mission 2 at first position", (done) => {
    request(server)
      .get("/api/missions?endDate=desc")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data[0].country).to.equal("United States");
        done();
      });
  });

  it("should return Mission 2 at first position", (done) => {
    request(server)
      .get("/api/missions?country=desc")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data[0].country).to.equal("United States");
        done();
      });
  });
});

describe("GET: /api/missions/:id", () => {
  it("should return mission data", (done) => {
    request(server)
      .get(`/api/missions/${getTestMission()._id.toString()}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.a("object");
        expect(res.body.data.country).to.equal("France");
        done();
      });
  });

  it("should return mission not found", (done) => {
    request(server)
      .get(`/api/missions/${getTestMission()._id.toString().slice(0, -1)}8`)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("Mission not found");
        done();
      });
  });
});

describe("POST: /api/missions", () => {
  it("should return missing country", (done) => {
    request(server)
      .post("/api/missions")
      .set("Cookie", getTestCookie())
      .send({
        startDate: "2020-01-01",
        endDate: "2020-01-01",
        rovers: [getTestRover2()._id.toString()],
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal('"country" is required');
        done();
      });
  });

  it("should return missing startDate", (done) => {
    request(server)
      .post("/api/missions")
      .set("Cookie", getTestCookie())
      .send({
        country: "France",
        endDate: "2020-01-01",
        rovers: [getTestRover2()._id.toString()],
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal('"startDate" is required');
        done();
      });
  });

  it("should return missing endDate", (done) => {
    request(server)
      .post("/api/missions")
      .set("Cookie", getTestCookie())
      .send({
        country: "France",
        startDate: "2020-01-01",
        rovers: [getTestRover2()._id.toString()],
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal('"endDate" is required');
        done();
      });
  });

  it("should return missing rovers", (done) => {
    request(server)
      .post("/api/missions")
      .set("Cookie", getTestCookie())
      .send({
        country: "France",
        startDate: "2020-01-01",
        endDate: "2020-01-01",
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal('"rovers" is required');
        done();
      });
  });

  it("should return 401 if user is not authenticated", (done) => {
    request(server)
      .post("/api/missions")
      .send({
        country: "France",
        startDate: "2020-01-01",
        endDate: "2020-01-01",
        rovers: [getTestRover2()._id.toString()],
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal("No token provided");
        done();
      });
  });

  it("should return error if rover is already used for this dates", (done) => {
    request(server)
      .post("/api/missions")
      .set("Cookie", getTestCookie())
      .send({
        country: "France",
        startDate: getTestMission2().startDate,
        endDate: getTestMission2().endDate,
        rovers: [getTestRover2()._id.toString()],
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal(
          `Rover ${getTestRover2()._id.toString()} already assigned to another mission`
        );
        done();
      });
  });

  it("should return success", (done) => {
    request(server)
      .post("/api/missions")
      .set("Cookie", getTestCookie())
      .send({
        country: "France",
        startDate: "2020-01-01",
        endDate: "2020-01-01",
        rovers: [getTestRover2()._id.toString()],
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("Mission created successfully");
        done();
      });
  });
});

describe("PUT: /api/missions/:id", () => {
  it("should return mission not found", (done) => {
    request(server)
      .put(`/api/missions/${getTestMission()._id.toString().slice(0, -1)}8`)
      .set("Cookie", getTestCookie())
      .send({
        country: "Updated",
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("Mission not found");
        done();
      });
  });

  it("should return 401 if user is not authenticated", (done) => {
    request(server)
      .put(`/api/missions/${getTestMission()._id.toString()}`)
      .send({
        country: "Updated",
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("No token provided");
        done();
      });
  });

  it("should return error if rover is already used for this dates", (done) => {
    request(server)
      .put(`/api/missions/${getTestMission2()._id.toString()}`)
      .set("Cookie", getTestCookie())
      .send({
        country: "Updated",
        startDate: getTestMission().startDate,
        endDate: getTestMission().endDate,
        rovers: [getTestRover()._id.toString()],
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.a("string");
        expect(res.body.error).to.equal(
          `Rover ${getTestRover()._id.toString()} already assigned to another mission`
        );
        done();
      });
  });

  it("should return success", (done) => {
    request(server)
      .put(`/api/missions/${getTestMission()._id.toString()}`)
      .set("Cookie", getTestCookie())
      .send({
        country: "Updated",
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("Mission updated successfully");
        done();
      });
  });
});

describe("DELETE: /api/missions/:id", () => {
  it("should return mission not found", (done) => {
    request(server)
      .delete(`/api/missions/${getTestMission()._id.toString().slice(0, -1)}8`)
      .set("Cookie", getTestCookie())
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("Mission not found");
        done();
      });
  });

  it("should return 401 if user is not authenticated", (done) => {
    request(server)
      .delete(`/api/missions/${getTestMission()._id.toString()}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("No token provided");
        done();
      });
  });

  it("should return error beacause user is not admin or owner", (done) => {
    request(server)
      .delete(`/api/missions/${getTestMission2()._id.toString()}`)
      .set("Cookie", getTestCookie())
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("You can't delete this mission");
        done();
      });
  });

  it("should return success", (done) => {
    request(server)
      .delete(`/api/missions/${getTestMission()._id.toString()}`)
      .set("Cookie", getTestCookie())
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("Mission deleted successfully");
        done();
      });
  });
});
