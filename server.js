require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const cookieParser = require('cookie-parser');

//Connect to Db
require('./helpers/db-connect');

//Open Server
app.listen(PORT, () => {
  console.log(`👍 Backend Server started at http://localhost:${PORT}`);
});

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // frontend URL should be configurable => //* later to do
    credentials: true, // allow cookies to be sent from frontend to us
  })
);
app.use(cookieParser());

//ROUTES;
app.get('/', (req, res) => {
  res.send('Hello World!');
});

//ERROR HANDLING
app.use(function errorHandler(err, req, res, next) {
  console.log('⛔ ', err);
  res.status(err.status || 500).send({
    error: {
      message: err.message,
    },
  });
});
