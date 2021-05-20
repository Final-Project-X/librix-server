# Librix server API Guide _18/05/2021_

Running locally is set to port 5000.

## Table of Contents

- [Layout](#layout)
- [Errors](#errors)
- [Users](#users)
- [Books](#books)
- [Matches](#matches)

## Layout

The layout of the sections below will be as follows:

- After the main heading will be the routes, eg. _/_ or _/:id_
- A brief description about what the call does, eg. _Add User_
- In those routes will be the calls avaiable, eg. _get_ or _post_
- In those calls will be one or many of the following: _Frontend Request_, _Backend Response_ and _Notes_
- **Notes** can about the Frontend or the Backend depending on what the come after, eg.

```
_Frontend Request_
_Notes_ (specificlly about the Frontend)
_Backend Response_
_Notes_ (specifically about the Backend)
```

---

## Errors

_Notes_ => If there is an error in any of the functions we return =>

```
{
  "error": {
    "message": "The error message"
  }
}
```

---

## Users

### /users/

- Add User
  **post**
  _Frontend Request_ =>

  ```
  {
    "username": "username",
    "email": "email@email.com",
    "password": "password",
    "address": {
      "city": "city"
    }
  }
  ```

  _Notes_ => That was the minimal request required, other fields that can be added include =>

  ```
  {
    "firstName": "firstName",
    "lastName": "lastName",
    "avatar": "avatar",
    "address": {
      "country": "country"
    }
  }
  ```

  _Backend Response_ =>

  ```
  {
    "avatar": "/statics/01.png",
    "points": 0,
    "booksToOffer": [],
    "booksToRemember": [],
    "booksInterestedIn": [],
    "matches": [],
    "_id": "60a38261cb726721a8101086",
    "username": "username",
    "email": "email@email.com",
    "address": {
      "country": "Germany",
      "city": "city"
    },
    "createdAt": "2021-05-18T09:01:21.791Z",
    "updatedAt": "2021-05-18T09:01:21.791Z"
  }
  ```

  _Notes_ => This was based on the minimal request => This response will be refered to in future as **UserObject**

### /users/login

- Login User
  **post**
  _Frontend Request_ =>

  ```
  {
    "email": "the users email",
    "password": "the users password"
  }
  ```

  _Backend Response_ => **UserObject**

### /users/:id

- Get User
  **get**
  _Backend Response_ => **UserObject**

- Update one/many Fields In A User
  **put**
  _Frontend Request_ => Any **UserObject** field that is not a _Mongoose ID_
  _Notes_ => If the field is made up =>

  ```
  {
    "This field does not exsist": "user data"
  }
  ```

  Will **not** return an error, just the **UserObject** not changed in any way. If you try and change a field that is a _Mongoose ID_, you will recieve an error.
  _Backend Response_ => **UserObject**
  _Notes_ => The fields changed will be shown straight away in the response.

- Delete User
  **del**
  _Backend Response_ => **UserObject**

- Add a match
  **post**
  _Frontend Request_ =>

  ```
  {
    "bookOne": "a mongoose id of a book the user is interested in",
    "bookTwo": "a mongoose id of a book the user owns"
  }
  ```

  _Backend Response_ =>

  ```
  {
    "status": "pending",
    "_id": "mongoose id",
    "bookOne": "mongoose id",
    "bookTwo": "mongoose id",
    "chat": [],
    "createdAt": "2021-05-19T12:04:20.084Z",
    "updatedAt": "2021-05-19T13:19:02.152Z"
  }
  ```

---

## Books

### /books/

- Add Book
  **post**
  _Frontend Request_ =>

  ```
  {
    "title": "title",
    "authors": ["author"],
    "publishedDate": Number,
    "isbn": ["number"],
    "pages": Number,
    "shape": "shape",
    "category": ["category"],
    "selectedFiles": ["selected file"],
    "owner": "a valid user mongoose id"
  }
  ```

  _Notes_ => This is the minimal request required, other fields that can be added include =>

  ```
  {
    "description": "description"
  }
  ```

  _Backend Response_ =>

  ```
  {
    "authors": [
      "author"
    ],
    "isbn": [
      "number"
    ],
    "city": "Berlin",
    "category": [
      "category"
    ],
    "selectedFiles": [
      "selected file"
    ],
    "reserved": false,
    "interestedUsers": [],
    "_id": "60a4fcafdc05045950cdec34",
    "title": "title",
    "publishedDate": "1",
    "pages": 1,
    "shape": "shape",
    "owner": "60a4d2004c848653cf3c98ca",
    "createdAt": "2021-05-19T11:55:27.200Z",
    "updatedAt": "2021-05-19T11:55:27.200Z"
  }
  ```

  _Notes_ => from now on we will refer to this object as **BookObkect**

### /books/savedBooks

- Add a book to your books to remember
  **post**
  _Frontend Request_ =>

  ```
  {
    "userId": "mongoose id",
    "bookId": "mongoose id"
  }
  ```

  _Notes_ => This will happen when the user swipes to save a book for later.
  _Backend Response_ => **BookObject**
  _Notes_ => Currently in the process of making a middleware that can stop the duplication of saved books, however right now you can save the same user to a book multiple times.

### /books/:id

- Get Book
  **get**
  _Backend Response_ => **BookObject**

- Update one/many Fields In A Book
  **put**
  _Frontend Request_ => Any **BookObject** field that is not a _Mongoose ID_
  _Notes_ => If the field is made up =>

  ```
  "This field does not exsist": "book data"
  ```

  Will **not** return an error, just the **BookObject** not changed in any way. If you try and change a field that is a _Mongoose ID_, you will recieve an error.
  _Backend Response_ => **BookObject**
  _Notes_ => The fields changed will be shown straight away in the response

- Delete Book
  **del**
  _Backend Response_ => **BookObject**

### /books/user

- Add Interested User To Book
  **post**
  _Frontend Request_ =>

  ```
  {
    "userId": "mongoose id",
    "bookId": "mongoose id"
  }
  ```

  _Notes_ => This will happen when the user swipes that they like a book.
  _Backend Response_ => **BookObject**
  _Notes_ => Currently in the process of making a middleware that can stop the duplication of interested user, however right now you can add the same user to a book multiple times.

### /books/user/:city

- Get Library For User To swipe
  **get**
  _Backend Response_ => An object containing the key "userLibrary", which holds an array of **BookObject**.
  _Notes_ => If the array is empty (there are no cities) this will return an error.

---

## Matches

### /matches/:id

- Get a singular match
  **get**
  _Backend Response_ =>

  ```
  {
  "status": "pending",
  "_id": "60a4fec466b26d9f9750def0",
  "bookOne": {
    "authors": [
      "Suzy Toronto"
    ],
    "isbn": [
      "1680880721",
      "9781680880724"
    ],
    "city": "berlin",
    "category": [
      "Self-Help"
    ],
    "selectedFiles": [],
    "reserved": false,
    "interestedUsers": [
      "60a4febb66b26d9f9750dedd",
      "60a4febb66b26d9f9750dedf"
    ],
    "_id": "60a4febf66b26d9f9750dee7",
    "title": "Life Is Short Buy the Boots and Other Wonderful Wacky Words of Wisdom",
    "description": "Author, artist Suzy Toronto believes life is a journey that's meant to be enjoyed -- and there's no better way to travel to wherever life takes you than in a rockin' hot pair of boots! Suzy's wacky words of advice and wisdom will have you kicking up your heels and dancing the do-si-do, stop worrying about every little thing, and focusing instead on what is truly important. Life is filled with uncertainty, and sometimes you just have to jump in, even if it means getting your boots a little dirty. So... dream big, live it up, shine bright like the person you know you are, and for heaven's sake, go ahead and buy that pair of boots you've had your eye on.",
    "publishedDate": "2016-09-01",
    "pages": 44,
    "shape": "as good as new",
    "owner": "60a4febb66b26d9f9750dedc",
    "createdAt": "2021-05-19T12:04:15.033Z",
    "updatedAt": "2021-05-19T12:04:19.506Z"
  },
  "bookTwo": {
    "authors": [
      "Roman Mars",
      "Kurt Kohlstedt",
      "99% Invisible"
    ],
    "isbn": [
      "1529355273",
      "9781529355277"
    ],
    "city": "berlin",
    "category": [],
    "selectedFiles": [],
    "reserved": false,
    "interestedUsers": [
      "60a4febb66b26d9f9750dedc",
      "60a4febb66b26d9f9750dedd"
    ],
    "_id": "60a4febf66b26d9f9750dee8",
    "title": "The 99% Invisible City",
    "subtitle": "A Field Guide to the Wonders of the Modern Metropolis",
    "description": "99% Invisible' is a big-ideas podcast about small-seeming things, revealing stories baked into the buildings we inhabit, the streets we drive, and the sidewalks we traverse. The show celebrates design and architecture in all of its functional glory and accidental absurdity, with intriguing tales of both designers and the people impacted by their designs.00Now, in 'The 99% Invisible City: A Field Guide to Hidden World of Everyday Design', host Roman Mars and coauthor Kurt Kohlstedt zoom in on the various elements that make our cities work, exploring the origins and other fascinating stories behind everything from power grids and fire escapes to drinking fountains and street signs. With deeply researched entries and beautiful line drawings throughout, The 99% Invisible City will captivate devoted fans of the show and anyone curious about design, urban environments, and the unsung marvels of the world around them.",
    "publishedDate": "2020-10-06",
    "pages": 288,
    "shape": "as good as new",
    "owner": "60a4febb66b26d9f9750dedf",
    "createdAt": "2021-05-19T12:04:15.480Z",
    "updatedAt": "2021-05-19T12:04:19.180Z"
  },
  "chat": [],
  "createdAt": "2021-05-19T12:04:20.084Z",
  "updatedAt": "2021-05-19T12:04:20.084Z"
  }
  ```

  _Notes_ => from now on this object will be refered to as **MatchObject**

- Update a match
  **put**
  _Frontend Request_ => The only thing that would need updating is the "status" =>

  ```
  {
    "status": "accepted"
  }
  ```

  _Backend Response_ =>

  ```
  {
    "status": "accepted",
    "_id": "60a4fec466b26d9f9750def0",
    "bookOne": "60a4febf66b26d9f9750dee7",
    "bookTwo": "60a4febf66b26d9f9750dee8",
    "chat": [],
    "createdAt": "2021-05-19T12:04:20.084Z",
    "updatedAt": "2021-05-19T13:19:02.152Z"
  }
  ```

  _Notes_ => this does not come with the populated book fields.

- Delete a match
  **del**
  _Backend Response_ => **MatchObject**
