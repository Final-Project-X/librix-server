const customResponse = (message) => {
  let notification = {
    response: {
      message: message,
    },
  };
  return notification;
};

module.exports = customResponse;
