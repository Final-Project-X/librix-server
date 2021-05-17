//const Match = require('../models/Match');

exports.webSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`👍 connected to ${socket.id}`);

    socket.on('typing', (user, text) => {
      socket.broadcast.emit('typing', user, text);
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
