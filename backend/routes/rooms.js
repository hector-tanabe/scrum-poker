const express = require("express");

const Room = require('../models/room');

const router = express.Router();

const ObjectID = require('mongodb').ObjectID;

router.post('', (req, res, next) => {
  const room = new Room({
    creator: req.body.creator,
    roomName: req.body.roomName,
    show: false
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
    creatorId: req.body.creatorId,
    creator: req.body.creator,
    roomName: req.body.roomName
  })
  Room.updateOne({_id: req.params.id}, room).then(result => {
    res.status(200).json({ message: "Update successful!"})
  })
});

router.put("/:id/show", (req, res, next) => {
  const room = new Room({
    _id: req.body.id,
    show: req.body.show
  })
  console.log({_id: room._id}, {$set: {show: room.show}});
  Room.updateOne({_id: room._id}, {$set: {show: room.show}}).then(result => {
    console.log(result);
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
