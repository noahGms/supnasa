const mongoose = require('mongoose');

const roverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  constructionDate: {
    type: Date,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const Rover = mongoose.model('Rover', roverSchema);

module.exports = Rover;
