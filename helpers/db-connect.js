const mongoose = require('mongoose');

//MongoDb Connection
const strConn = process.env.MONGO_URI;

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

mongoose
  .connect(strConn, connectOptions)
  .then(() => console.log('👍 Connection to cloud database established!'))
  .catch((err) => console.log('⛔ [ERROR] DB Connection failed', err));

module.exports = mongoose.connection;
