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

## Errors

_Notes_ => If there is an error in any of the functions we return =>

```
{
  "error": {
    "message": "The error message"
  }
}
```

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

### /users/:id

- Get User
  **get**
  _Backend Response_ => **UserObject**

- Update one/many Fields In A User
  **put**
  _Frontend Request_ => Any **UserObject** field that is not a _Mongoose ID_
  _Notes_ => If the field is made up =>

  ```
  "This field does not exsist": "user data"
  ```

  Will **not** return an error, just the **UserObject** not changed in any way. If you try and change a field that is a _Mongoose ID_, you will recieve an error.
  _Backend Response_ => **UserObject**
  _Notes_ => The fields changed will be shown straight away in the response.

- Delete User
  **del**
  _Backend Response_ => **UserObject**

### /users/login

- Login User
  **post**
  _Frontend Request_ =>

  ```
  {
    "email": "the users email"
  }
  ```

  _Notes_ => currently working on password implementation
  _Backend Response_ => **UserObject**

## Books

### /books/

- Add Book
  **post**
  _Frontend Request_ =>

  ```
  {
    "title": "title",
    "description": "description",
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

  _Notes_ => This is the minimal request required => The city field will default to berlin
  _Backend Response_ =>

  ```
  {
    "newBook": {
      "authors": [
        "J. K. Rowling"
      ],
      "isbn": ["number"],
      "city": "Berlin",
      "category": [
        "fantasy"
      ],
      "selectedFiles": [
        "file 03"
      ],
      "reserved": false,
      "interestedUsers": [],
      "_id": "60a351257062560d179d7d97",
      "title": "xmen",
      "subtitle": "The Big X",
      "publishedDate": "2002",
      "pages": 10,
      "shape": "good condition",
      "owner": "60a25ada6d711a9e70faa165",
      "createdAt": "2021-05-18T05:31:17.831Z",
      "updatedAt": "2021-05-18T05:31:17.831Z"
    },
    "addBookToUser": {
      "avatar": "https://cdn.fakercloud.com/avatars/jjshaw14_128.jpg",
      "points": 0,
      "booksToOffer": [
        "60a25ada6d711a9e70faa16a",
        "60a25adb6d711a9e70faa16c",
        "60a25ae16d711a9e70faa177",
        "60a350be7062560d179d7d96",
        "60a351257062560d179d7d97"
      ],
      "booksToRemember": [
        "60a25adc6d711a9e70faa16d"
      ],
      "booksInterestedIn": [
        "60a25ae06d711a9e70faa176",
        "60a25ae16d711a9e70faa178"
      ],
      "matches": [],
      "_id": "60a25ada6d711a9e70faa165",
      "firstName": "Rickie",
      "lastName": "Kilback",
      "username": "Willa.Monahan",
      "email": "Carlo.Walker@gmail.com",
      "address": {
        "country": "Germany",
        "city": "Berlin"
      },
      "createdAt": "2021-05-17T12:00:26.167Z",
      "updatedAt": "2021-05-18T05:31:18.031Z"
    }
  }
  ```

  _Notes_ => the response: an object with "newBook": the book as an object && "addBookToUser": the **UserObject** => from now on we will refer to value (object) of "newBook" as **BookObkect**

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
  _Backend Response_ : An object containing the key "userLibrary", which holds an array of **BookObject**.
  _Notes_ : If the array is empty (there are no cities) this will return an error.

## Matches

Currently being created.
