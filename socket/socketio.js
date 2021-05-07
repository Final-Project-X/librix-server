//const Match = require('../models/Match');

exports.webSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`👍 connected to ${socket.id}`);

    // data: {username}
    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', data);
    });

    // message: {sender: username, date : new Date() , content: text, matchId}
    socket.on('chat', (message) => {
      console.log(message);
      //saveMessage(message);
      io.sockets.emit('chat', message);
    });
  });
};

// const saveMessage = async (message) => {
//   const { matchId } = message;

//   const matchChatToUpdate = await Match.findByID(matchId);

//   if (!matchChatToUpdate) {
//     console.log('something went very wrongs');
//     return;
//   }

//   matchChatToUpdate.chat.push(message);
//   matchChatToUpdate.save();
// };
