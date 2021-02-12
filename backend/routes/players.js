const express = require("express");

const Player = require('../models/player');

const router = express.Router();

router.post('', (req, res, next) => {
  const player = new Player({
    name: req.body.name,
    card: '-',
    roomId: req.body.roomId
  });
  player.save().then(newPlayer => {
    res.status(201).json({
      message: 'Player created successfully!',
      playerId: newPlayer._id
    });
  });
});

router.put("/:id/card/:card", (req, res, next) => {
  const player = new Player({
    _id: req.body.id,
    name: req.body.name,
    card: req.body.card,
    roomId: req.body.roomId
  })
  Player.where('_id', player.id).updateOne({$set: {card: player.card}}).then(result => {
    res.status(200).json({ message: "Update successful!"})
  })
});

router.put("/room/:roomId", (req, res, next) => {
  const player = new Player({
    _id: req.body.id,
    name: req.body.name,
    card: req.body.card,
    roomId: req.body.roomId
  })
  Player.where('roomId', player.roomId).updateMany({$set: {card: '-'}}).then(result => {
    res.status(200).json({ message: "Update successful!"})
  })
});

router.get("/room/:roomId", (req, res, next) => {
  Player.find({roomId: req.params.roomId})
    .then(documents => {
      res.status(200).json({
        message: 'Players fetched succesfully!',
        players: documents
      });
    });
});

router.delete('/:id', (req, res, next) => {
  Room.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({ message: 'Player deleted!'});
  });
});

module.exports = router;
