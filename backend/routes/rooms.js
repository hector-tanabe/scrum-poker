const express = require("express");

const Room = require('../models/room');

const router = express.Router();

router.post('', (req, res, next) => {
  const room = new Room({
    creator: req.body.creator,
    roomName: req.body.roomName
  });
  room.save().then(createdRoom => {
    res.status(201).json({
      message: 'Room created successfully!',
      roomId: createdRoom._id
    });
  });
});

router.put("/:id", (req, res, next) => {
  const room = new Room({
    _id: req.body.id,
    creator: req.body.creator,
    roomName: req.body.roomName
  })
  Room.updateOne({_id: req.params.id}, room).then(result => {
    res.status(200).json({ message: "Update successful!"})
  })
});

router.get('', (req, res, next) => {
  Room.find()
    .then(documents => {
      res.status(200).json({
        message: 'Room fetched succesfully!',
        rooms: documents
      });
    });
});

router.get("/:id", (req, res, next) => {
  Room.findById(req.params.id).then(room => {
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({message: 'Room not found!'});
    }
  })
});

router.delete('/:id', (req, res, next) => {
  Room.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({ message: 'Room deleted!'});
  });
});

module.exports = router;
