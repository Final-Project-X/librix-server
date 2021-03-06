require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const socket = require('socket.io');
const { webSocket } = require('./socket/socketio.js');
const cookieParser = require('cookie-parser');
const booksRouter = require('./routes/booksRouter');
const usersRouter = require('./routes/usersRouter');
const matchesRouter = require('./routes/matchesRouter');

const server = app.listen(PORT, () => {
  console.log(`👍 Backend Server started at http://localhost:${PORT}`);
});

const io = socket(server, {
  cors: {
    // configure CORS
    origin: '*',
  },
});

//Connect to Db
require('./helpers/db-connect');

webSocket(io);

//Middleware
app.use(express.json({ limit: '1000KB' }));
app.use(cookieParser());
app.use(express.static('public'));

//ROUTES;
app.get('/', (req, res) => {
  res.send(express.static('public'));
});

app.use('/books', booksRouter);
app.use('/user', usersRouter);
app.use('/matches', matchesRouter);

//ERROR HANDLING
app.use(function errorHandler(err, req, res, next) {
  console.log('⛔ ', err);
  res.status(err.status || 500).send({
    error: {
      message: err.message,
    },
  });
});
