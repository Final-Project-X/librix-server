require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Match = require('../models/Match');
const Book = require('../models/Book');
const faker = require('faker');
const fetch = require('node-fetch');

// connect to MongoDB

console.log('🌾 yo lets plant some seeeds');

// get the party started

//connect book with user
const connectBookWithUser = async (bookId, userId) => {
  let book = await Book.findById(bookId);

  if (!book) {
    console.log(`⛔ no book with that Id ${bookId} `);
  }

  if (userId.toString() === book.owner.toString()) {
    await book.save();
  } else {
    book.interestedUsers.push(userId);
    await book.save();
  }
};

const findMatch = async (interestedUserInBookId, bookOwnerId) => {
  let matchBooks = [];

  try {
    // data = book.interestedUsers[j] => user.id of user who is interested in book

    let checkBookOwner = await User.findById(bookOwnerId);

    // check which books the owner is interested in
    let findBooksToMatch = checkBookOwner.booksInterestedIn.map(
      (item) => item._id
    );

    for (item of findBooksToMatch) {
      let matchBook = await Book.findById(item);

      if (!matchBook) {
        console.log(`no matchBook found`);
      }

      let owner = matchBook.owner.toString();
      let interestedUser = interestedUserInBookId.toString();

      if (owner === interestedUser) {
        console.log('📖 thats a 💖 MATCH');
        matchBooks.push(matchBook);
      } else {
        console.log('💔 no match');
      }
    }

    return matchBooks;
  } catch (err) {
    console.log('⛔ ', err);
  }
};

(async function () {
  require('../helpers/db-connect');

  try {
    // delete old entries
    await User.deleteMany({});
    console.log(`✅ Old Users deleted `);
    await Match.deleteMany({});
    console.log(`✅ old matches deleted`);
    await Book.deleteMany({});
    console.log(`✅ old books deleted`);

    console.log(`-------Create users --------`);
    // create new users
    let users = [];
    for (let i = 0; i < 6; i++) {
      let user = await User.create({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'Test123!',
        avatar: faker.internet.avatar(),
        city: 'Berlin',
        points: 0,
      });
      users.push(user);
    }
    console.log('✅  stored 6 new Users in the Db');

    // create userIds
    const userIds = users.map((user) => user._id);

    console.log(`-------Create books --------`);
    //define test isbn's and fetch google Api for Books
    const isbn = [
      9780984782857,
      9781469646602,
      9783551354020,
      9783967141047,
      9780241459416,
      9780241431023,
      9781680880724,
      9781529355277,
      9783426281550,
      9781564848253,
      9781892005281,
      9781426205187,
      9783741612404,
      9780786965601,
      //9780553573404,
    ];

    let books = [];

    for (let i = 0; i < isbn.length; i++) {
      const googleApi = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn[i]}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
      //fetch one book
      const data = await fetch(googleApi);
      //console.log('ℹ️ calling new book with api =>', googleApi);
      const response = await data.json();
      const bookObj = response.items[0];

      //console.log(bookObj.volumeInfo);

      let book = await Book.create({
        title: bookObj.volumeInfo.title,
        subtitle: bookObj.volumeInfo.subtitle,
        description: bookObj.volumeInfo.description,
        authors: bookObj.volumeInfo.authors,
        publishedDate: bookObj.volumeInfo.publishedDate,
        city: 'berlin',
        isbn: [
          bookObj.volumeInfo.industryIdentifiers[0].identifier,
          bookObj.volumeInfo.industryIdentifiers[1].identifier,
        ],
        pages: bookObj.volumeInfo.pageCount,
        condition: 'as good as new',
        genre: 'i am a genre ',
        reserved: false,
        owner: faker.random.arrayElement(userIds),
      });

      let user = await User.findById(book.owner);
      user.booksToOffer.push(book._id);
      await user.save();

      books.push(book);
    }
    console.log('✅ stored new books in the Db');

    // create array of all books in library
    let bookIds = books.map((book) => book._id);

    console.log(`-------Connect Books and User --------`);

    let personalLibrary;
    let getPersonalBookIds = (data) => {
      for (let j = 0; j < data.booksToOffer.length; j++) {
        bookIds = bookIds.filter((bookId) => {
          return bookId.toString() !== data.booksToOffer[j].toString();
        });
        personalLibrary = bookIds;
      }
      return personalLibrary;
    };

    //CONNECT BOOKS AND USERS
    // give each user
    // -> 2 books to be interested in
    // -> 1 book for his booklist to remember
    // for Book => set interested User
    for (i = 0; i < 6; i++) {
      bookIds = books.map((book) => book._id);

      let user = await User.findById(userIds[i]);

      if (user.booksToOffer.length < 1) {
        console.log(`user ${user._id} has no books to offer.`);
      } else {
        let personalBookIds = await getPersonalBookIds(user);

        let randomBookId = Math.floor(Math.random() * personalBookIds.length);
        if (randomBookId === personalBookIds.length - 1) {
          randomBookId = 0;
        }

        user.booksInterestedIn = [
          personalBookIds[randomBookId],
          personalBookIds[randomBookId + 1],
        ];
        user.booksToRemember = [personalBookIds[i]];

        await user.save();

        await connectBookWithUser(personalBookIds[randomBookId], user._id);
        await connectBookWithUser(personalBookIds[randomBookId + 1], user._id);
      }
    }

    console.log(`------- Check for matches --------`);
    //reset book IDs
    bookIds = books.map((book) => book._id);
    console.log(' ✅ bookIds=> ', bookIds);

    //Check for matches
    const matches = [];

    for (let i = 0; i < bookIds.length; i++) {
      let book = await Book.findById(bookIds[i]);

      if (!book) console.log(`there is no book with id ${bookIds[i]}`);
      // console.log('❓ any matches for this book???');

      if (book.interestedUsers.length < 1)
        console.log('😔 no interested users in book');

      for (let j = 0; j < book.interestedUsers.length; j++) {
        let isMatch = await findMatch(book.interestedUsers[j], book.owner);

        if (isMatch.length < 1) {
          console.log(`----💔 no match created----`);
        } else {
          for (let i = 0; i < isMatch.length; i++) {
            // BE AWARE : per match are 2 DB entries created atm. This will NOT happen in real szenario , cause controller prevents behavior.

            let match = await Match.create({
              bookOne: book._id,
              bookTwo: isMatch[i]._id,
              status: 'pending',
            });

            await User.findByIdAndUpdate(book.owner, {
              $push: { matches: match._id },
            });
            await User.findByIdAndUpdate(isMatch[i].owner, {
              $push: { matches: match._id },
            });

            matches.push(match);
            console.log(`---💖 one match created : ${match}---`);
          }
        }
      }
    }
  } catch (err) {
    console.log('⛔ ', err);
  }
  mongoose.connection.close();
})();
