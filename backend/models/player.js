const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  name: { type: String, required: true },
  card: { type: String, required: true },
  roomId: { type: String, required: true }
});

module.exports = mongoose.model('Player', playerSchema);
