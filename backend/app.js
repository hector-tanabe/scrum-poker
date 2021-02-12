const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const io = require('socket.io')(3100, {
  cors: {
    origin: '*',
  }
});

const roomsRoutes = require("./routes/rooms");
const playersRoutes = require("./routes/players");
const players = require("./models/player");
const room = require("./models/room");

const app = express();

const uri = 'mongodb+srv://hector:A4iCyxXuApXXN8km@cluster0.fzyux.mongodb.net/scrum-poker-db?retryWrites=true&w=majority';
mongoose
      .connect(uri, { useNewUrlParser: true })
      .then(() => {
        io.on('connection',(socket)=>{
          // console.log('user connected')
        })
        players.watch().on('change',(change)=>{
          console.log('Something has changed')
          console.log('Players:', change);
          io.emit('changes',change)
        })
        room.watch().on('change',(change)=>{
          console.log('Something has changed in a room')
          console.log('Room:', change);
          io.emit('changesRoom',change)
        })
        return console.log(`Successfully connected to ${uri}`);
      })
      .catch(error => {
        console.log("Error connecting to database: ", error);
        return process.exit(1);
      });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods',
  'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

app.use("/api/rooms", roomsRoutes);
app.use("/api/players", playersRoutes);

module.exports = app;
