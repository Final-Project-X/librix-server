const customResponse = (message, note = 'response') => {
  let notification = {
    type: note,
    msg: message,
  };
  return notification;
};

module.exports = customResponse;
