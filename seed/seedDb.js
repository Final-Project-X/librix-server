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

(async function () {
  require('../helpers/db-connect');

  try {
    // delete old entries
    await User.deleteMany({});
    console.log(`✅ Old Users deleted `);
    // await Match.deleteMany({});
    // console.log(`✅ old matches deleted`);
    await Book.deleteMany({});
    console.log(`✅ old books deleted`);

    // create new users
    let users = [];
    for (let i = 0; i < 5; i++) {
      let user = await User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'Test123!',
        avatar: faker.internet.avatar(),
        address: {
          street: faker.address.streetAddress(),
          zipcode: faker.address.zipCode(),
          city: 'Berlin',
        },
        points: 0,
      });
      users.push(user);
    }
    console.log('✅  stored 5 new Users in the Db', users);

    // create userIds
    const userIds = users.map((user) => user._id);
    console.log('userIds =>', userIds);

    //define test isbn's and fetch google Api for Books
    const isbn = [
      9780984782857,
      9781844037353,
      9783551354020,
      9783967141047,
      9780241459416,
      9780241431023,
      9781680880724,
      9781529355277,
      9783426281550,
      9783596705948,
    ];

    const getRandomIsbn = () => {
      const rand = Math.floor(Math.random() * isbn.length);
      return isbn[rand];
    };
    console.log('random isbn ', getRandomIsbn());

    //create Books
    let books = [];

    for (let i = 0; i < 7; i++) {
      const googleApi = `https://www.googleapis.com/books/v1/volumes?q=isbn:${getRandomIsbn()}&key=${
        process.env.GOOGLE_BOOKS_API_KEY
      }`;
      //fetch one book
      const data = await fetch(googleApi);
      console.log('ℹ️ calling new book with api =>', googleApi);
      const response = await data.json();
      const bookObj = response.items[0];
      console.log(
        'data =>',
        response.items,
        'volumeInfo=>',
        response.items[0].volumeInfo
      );

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
        shape: 'as good as new',
        category: bookObj.volumeInfo.categories,
        reserved: false,
        owner: faker.random.arrayElement(userIds),
      });

      books.push(book);
    }
    console.log('stored books=> ', books, '✅ stored 8 new books in the Db');

    // create bookIds
    const bookIds = books.map((book) => book._id);
    console.log('bookIds=> ', bookIds);

    const Matches = [];

    // give each user
    // -> 1 book to offer in his bookshelf
    // -> 2 books to be interested in
    // -> 1 book for his booklist to remember
    // for Book => set interested User
    for (i = 0; i < 4; i++) {
      let user = await User.findById(userIds[i]);
      user.booksToOffer = [bookIds[i]];
      user.booksToRemember = [bookIds[i + 3]];
      user.booksInterestedIn = [bookIds[i + 1], bookIds[i + 2]];
      console.log(`ℹ️ changed user ${user._id} to ${user}`);
      await user.save();

      //connect book with user
      let book = await Book.findById(bookIds[i + 1]);
      user._id === book.owner
        ? await book.save()
        : (book.interestedUsers = [user._id]);
      //console.log('ℹ️ set user in book: ', book);
      await book.save();

      let bookTwo = await Book.findById(bookIds[i + 2]);
      user._id === book.owner
        ? await book.save()
        : bookTwo.interestedUsers.push(user._id);
      //console.log('ℹ️ set user in bookTwo: ', bookTwo);
      await bookTwo.save();

      console.log(`ℹ️ set interested user ${user._id} in 2 books .`);

      //create a match
      //let exchangeBook = user.booksToOffer.map((item) => item.interestedUsers);
      //console.log(`exchangeBook =>`, exchangeBook);
      // also possible
      // if (
      //   book.owner ===
      //   book.interestedUsers[j].booksToOffer.map((book) =>
      //     book.interestedUsers.find(owner)
      //   )

      // let exchangeBook = user.booksToOffer.map((item) =>
      //   item.interestedUsers.find(book.owner)
      // );
      // console.log(`exchangeBook =>`, exchangeBook);
      // let match = await Match.create({
      //   BooksToChange: [book._id, exchangeBook._id],
      //   BookToChange: book._id,
      //   BookToReceive: exchangeBook._id,
      // });
      //}
    }
  } catch (err) {
    console.log('⛔ ', err);
  }
  mongoose.connection.close();
})();
