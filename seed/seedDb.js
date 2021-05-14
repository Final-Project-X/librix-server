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
  console.log(`🐛 ConnectBookWithUser=> ${book.owner} vs ${userId}`);

  if (userId === book.owner) {
    await book.save();
  } else {
    book.interestedUsers.push(userId);
    await book.save();
    console.log('ℹ️ set user in book: ', book);
  }
};

const findMatch = async (interestedUserInBookId, bookOwnerId) => {
  let matchBooks = [];

  try {
    // data = book.interestedUsers[j] => user.id of user who is interested in book (chrissi if its lukes book)

    //way with user => find luke
    let checkBookOwner = await User.findById(bookOwnerId);
    console.log('🐛 CHECK CHECK ', checkBookOwner);

    // check which books luke is interested in
    let findBooksToMatch = checkBookOwner.booksInterestedIn.map(
      (item) => item._id
    );
    console.log('🐛 CHECK CHECK interested books of owner', findBooksToMatch);

    for (item of findBooksToMatch) {
      console.log('IDDDDD==============>', item);
      let matchBook = await Book.findById(item);

      if (!matchBook) {
        console.log(`no matchBook found`);
      }

      console.log(
        `====> matchBook.owner: 
        ${matchBook.owner} vs interestedUser:
        ${interestedUserInBookId} `
      );

      let owner = matchBook.owner.toString();
      let interestedUser = interestedUserInBookId.toString();

      console.log(
        'TYPES:',
        'Owner:',
        typeof owner,
        'interestedUser: ',
        typeof interestedUser
      );

      if (owner == interestedUser) {
        console.log('📖 thats the book 💖 to MATCH   ', matchBook);
        matchBooks.push(matchBook);
      } else {
        console.log('💔 no match');
      }
    }

    return matchBooks;

    //return getBookToMatch
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
    console.log('✅  stored 5 new Users in the Db');

    // create userIds
    const userIds = users.map((user) => user._id);
    console.log('userIds =>', userIds);

    console.log(`-------Create books --------`);
    //define test isbn's and fetch google Api for Books
    const isbn = [
      9780984782857,
      //9781844037353,
      9783551354020,
      9783967141047,
      9780241459416,
      9780241431023,
      9781680880724,
      9781529355277,
      9783426281550,
    ];

    const getRandomIsbn = () => {
      const rand = Math.floor(Math.random() * isbn.length);
      return isbn[rand];
    };
    //console.log('random isbn ', getRandomIsbn());

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
      //console.log(
      //   'data =>',
      //   response.items,
      //   'volumeInfo=>',
      //   response.items[0].volumeInfo
      // );

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

      console.log(
        `🐛 set book: ${book._id} as bookToOffer of book.owner: ${book.owner}`
      );
      let user = await User.findById(book.owner);
      user.booksToOffer.push(book._id);
      console.log(
        '🐛 set booksToOffer',
        user.booksToOffer,
        ' in user:  ',
        user
      );
      await user.save();

      books.push(book);
    }
    console.log('✅ stored 7 new books in the Db');

    // create array of all books in library
    let bookIds = books.map((book) => book._id);
    console.log('bookIds=> ', bookIds);

    console.log(`-------Connect Books and User --------`);

    //CONNECT BOOKS AND USERS
    // give each user
    // -> 2 books to be interested in
    // -> 1 book for his booklist to remember
    // for Book => set interested User
    for (i = 0; i < 5; i++) {
      let user = await User.findById(userIds[i]);
      let personalLibrary;

      console.log(`==> user to connect ${user}`);

      if (user.booksToOffer.length < 1) {
        user.booksInterestedIn = [bookIds[i + 1], bookIds[i + 2]];
        user.booksToRemember = [bookIds[i]];

        console.log(`ℹ️ changed user ${user._id} to ${user}`);
        await user.save();

        await connectBookWithUser(bookIds[i + 1], user._id);
        await connectBookWithUser(bookIds[i + 2], user._id);
        console.log(`✅  set interested user ${user._id} in 2 books.`);
      } else {
        let getPersonalBookIds = (data) => {
          for (let i = 0; i < data.booksToOffer.length; i++) {
            bookIds = bookIds.filter(
              (bookId) => bookId !== data.booksToOffer[i]
            );
            personalLibrary = bookIds;
            console.log(' 🐛 get personal Library', personalLibrary);
          }
          return personalLibrary;
        };

        let personalBookIds = await getPersonalBookIds(user);
        console.log('PersonalBookIds:', personalBookIds);

        console.log(
          `🐛  split books to offer ${user.booksToOffer} from bookIds => done ${personalBookIds}`
        );

        user.booksInterestedIn = [
          personalBookIds[i + 1],
          personalBookIds[i + 2],
        ];
        user.booksToRemember = [personalBookIds[i]];

        console.log(`ℹ️ changed user ${user._id} to ${user}`);
        await user.save();

        await connectBookWithUser(personalBookIds[i + 1], user._id);
        await connectBookWithUser(personalBookIds[i + 2], user._id);
        console.log(`✅  set interested user ${user._id} in 2 books.`);
      }
    }

    console.log(`------- Check for matches --------`);
    //reset book IDs
    bookIds = books.map((book) => book._id);
    console.log('bookIds=> ', bookIds);

    //Check for matches
    const matches = [];

    for (let i = 0; i < bookIds.length; i++) {
      let book = await Book.findById(bookIds[i]);

      if (!book) console.log(`there is no book with id ${bookIds[i]}`);
      console.log('❓ any matches for this book???', book);

      if (book.interestedUsers.length < 1)
        console.log('😔 no interested users in book:');

      for (let j = 0; j < book.interestedUsers.length; j++) {
        let isMatch = await findMatch(book.interestedUsers[j], book.owner);
        console.log('is maaaaaatch =====>>>>>', isMatch);

        if (isMatch.length < 1) {
          console.log(`💔 no match created
        ---------------------------------`);
        } else {
          for (let i = 0; i < isMatch.length; i++) {
            let match = await Match.create({
              BooksToChange: [book._id, isMatch[i]._id],
              BookToChange: isMatch[i]._id,
              BookToReceive: book._id,
              status: 'pending',
            });
            matches.push(match);
            console.log(`💖 one match created : ${match}
          -------------------------------------------`);
          }
        }
      }
    }

    //create a possible match
    // check booksToOffer of interested users , if they have the book owner as interested user itself
    //with find match function but logic like
    //* if (book.owner === book.interestedUsers[j].booksToOffer.map((book) =>
    //*     book.interestedUsers.find(owner)
    //*   )
    //OR
    // * let exchangeBook = user.booksToOffer.map((item) => item.interestedUsers.find(book.owner));
  } catch (err) {
    console.log('⛔ ', err);
  }
  mongoose.connection.close();
})();
