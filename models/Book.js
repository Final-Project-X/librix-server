const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const BookSchema = new Schema(
  {
    // general book information maybe api
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    description: { type: String, required: true },
    authors: [{ type: String, required: true }],
    publishedDate: { type: String, required: true },
    isbn: [{ type: String, required: true }],
    city: { type: String, required: true, default: 'Berlin' },
    pages: { type: Number, required: false },
    // manual upload
    shape: { type: String, required: true },
    category: [{ type: String, required: true }],
    // Pics
    selectedFiles: [{ type: String, required: true }],
    // availability by default
    reserved: { type: Boolean, default: false },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interestedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Book = model('Book', BookSchema);

module.exports = Book;

// Book.owner(Luke) === Book.interestedUser(Chrissi).booksToOffer(Chrissis books).map( chrissis book)=> book.interestedUsers.find(luke))

//* Book.owner(Luke) === Book.interestedUser(Chrissi).booksInterestedIn.find(luke))

/**
  booksToOffer.map(book => {
      book.interestUsers.find(person => userOne._id === person._id);
  })
 * 
 userOne starts by swiping a book => puts their id into interestedUsers of bookSchemaOne
 we grab the id of the own of bookSchemaOne
 we go back to userOne booksInterestedIn
 we see if any of the book schemas owner id equals the bookSchemaOne owners id
 *
 * /


 // userOne(() => booksToOffer.interestedUsers) => userTwo(() => booksInterestedIn.owner*/
