// make connection
let socket = io.connect('http://localhost:5000');

//query dom
const message = document.getElementById('message');
const handle = document.getElementById('handle');
const btn = document.getElementById('send');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');

//emit events
btn.addEventListener('click', () => {
  console.log('I am hitting the btn');
  // first is the name
  // second is the
  socket.emit('chat', {
    message: message.value,
    matchId: '1234',
    sender: 'max',
    date: new Date(),
    handle: handle.value,
  });
});

message.addEventListener('keypress', () => {
  socket.emit('typing', handle.value);
});

// listen for events
socket.on('chat', (data) => {
  feedback.innerHTML = '';
  output.innerHTML += `<p><strong>${data.handle}:</strong> ${data.message}</p>`;
  message.value = '';
});

socket.on('typing', (data) => {
  feedback.innerHTML = '';
  feedback.innerHTML += `<p><em>${data} is typing a message ... </p></em>`;
});
