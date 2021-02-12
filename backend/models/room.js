const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  creatorId: { type: String },
  creator: { type: String, required: true },
  roomName: { type: String, required: true },
  show: { type: Boolean, required: true }
});

module.exports = mongoose.model('Room', roomSchema);
