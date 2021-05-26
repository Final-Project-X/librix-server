const userLibrary = [
  { _id: '123' },
  { _id: '1234' },
  { _id: '12345' },
  { _id: '12' },
  { _id: '1' },
  { _id: '7' },
  { _id: '15' },
];

const user = {
  booksToOffer: ['1', '45', '123'],
  booksToRemember: ['7'],
};

const filteredUserLibrary = userLibrary.filter((book) => {
  let isNotAlreadyAssosiatedWithUser = true;

  user.booksToOffer.map((id) => {
    if (book._id.toString() === id.toString()) {
      isNotAlreadyAssosiatedWithUser = false;
    }
  });

  user.booksToRemember.map((id) => {
    if (book._id.toString() === id.toString()) {
      isNotAlreadyAssosiatedWithUser = false;
    }
  });

  user.booksInterestedIn.map((id) => {
    if (book._id.toString() === id.toString()) {
      isNotAlreadyAssosiatedWithUser = false;
    }
  });

  user.matches.map((match) => {
    if (
      book._id.toString() === match.bookOne._id.toString() ||
      book._id.toString() === match.bookTwo._id.toString()
    ) {
      isNotAlreadyAssosiatedWithUser = false;
    }
  });

  if (isNotAlreadyAssosiatedWithUser) {
    return book;
  }
});

console.log(filteredUserLibrary);
