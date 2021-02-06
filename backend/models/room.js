const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  creator: { type: String, required: true },
  roomName: { type: String, required: true }
});

module.exports = mongoose.model('Room', roomSchema);
