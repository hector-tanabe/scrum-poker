const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const io = require('socket.io')(3100);
const io = require('socket.io')(3100, {
  cors: {
    origin: '*',
  }
});

const roomsRoutes = require("./routes/rooms");
const playersRoutes = require("./routes/players");
const players = require("./models/player");

const app = express();

// const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://hector:A4iCyxXuApXXN8km@cluster0.fzyux.mongodb.net/scrum-poker-db?retryWrites=true&w=majority';
// const client = new MongoClient(uri, { useNewUrlParser: true });
/*client.connect(err => {
  const collection = client.db("demo").collection("posts");
  console.log(collection);
  // perform actions on the collection object
  client.close();
});*/
mongoose
      .connect(uri, { useNewUrlParser: true })
      .then(() => {
        io.on('connection',(socket)=>{
          // console.log('user connected')
          /*socket.on('changes',(data)=>{
              console.log('user joined room')
              console.log(data);
              socket.join(data.myID)
          })*/
          /*socket.on('newdata', function (data) {
            console.log(data);
            io.emit('new-data', { data: data });
          });
          socket.on('updatedata', function (data) {
            io.emit('update-data', { data: data });
          });*/
        })
        players.watch().on('change',(change)=>{
          console.log('Something has changed')
          console.log(change);
          // io.to(change).emit('changes',change)
          io.emit('changes',change)
        })
        return console.log(`Successfully connected to ${uri}`);
      })
      .catch(error => {
        console.log("Error connecting to database: ", error);
        return process.exit(1);
      });
/*mongoose.connect('mongodb+srv://hector_32:70849148@cluster0.m3s0i.mongodb.net/demo?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database!')
  })
  .catch(() => {
    console.log('Connection failed!')
  });*/

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
