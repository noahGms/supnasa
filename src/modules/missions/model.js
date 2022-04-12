const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  rovers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rover",
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Mission = mongoose.model("Mission", missionSchema);

module.exports = Mission;
