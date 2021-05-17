let user = {
  name: 'anton',
  booksToOffer: ['123', '1234', '1235'],
};

let bookIds = [
  '12345',
  '1648',
  '123',
  '8735',
  '1234',
  '04657',
  '74658',
  '1235',
];
let personalLibrary;

let getPersonalBookIds = (user) => {
  for (let i = 0; i < user.booksToOffer.length; i++) {
    bookIds = bookIds.filter((bookId) => bookId !== user.booksToOffer[i]);
    personalLibrary = bookIds;

    console.log(' 🐛 get personal Library', personalLibrary);
  }
  return personalLibrary;
};

let personalBookIds = getPersonalBookIds(user);
console.log('PersonalBookIds:', personalBookIds);
