# Librix server API Guide _18/05/2021_

Running locally is set to port 5000.

## Table of Contents

- [Errors](#errors)
- [Users](#users)
- [Books](#books)
- [Matches](#matches)

## Errors

If there is an error in any of the functions we return =>

```
{
  "error": {
    "message": "The error message"
  }
}
```

## Users

All user calls start with /users

### /

- Add User
  **post** => expects the following minimal request

```
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "JohnSmith",
  "email": "John@Smith.com",
  "password": "0123abc!@£",
  "address": {
	  "city": "Berlin"
  }
}
```

Will recieve the response =>

```
{
  "avatar": "/statics/01.png",
  "points": 0,
  "booksToOffer": [],
  "booksToRemember": [],
  "booksInterestedIn": [],
  "matches": [],
  "_id": "60a26618f8d1360733111027",
  "firstName": "John",
  "lastName": "Smith",
  "username": "JohnSmith",
  "email": "John@Smith.com",
  "address": {
    "country": "Germany",
    "city": "Berlin"
  },
  "createdAt": "2021-05-17T12:48:24.125Z",
  "updatedAt": "2021-05-17T12:48:24.125Z"
}
``
```

### /:id

- Get User
  **get** => response is an the user as an object

- Update one/many Fields In A User
  **put** => If the field is made up =>

```
"This": "is not a field"
```

Will **not** return an error, just the user as an object not changed in any way. If you try and change a field that is a _mongoose id_, you will recieve an error. Fields that can be changed include =>

```
{
  "avatar": "https://cdn.fakercloud.com/avatars/aislinnkelly_128.jpg",
  "points": 2,
  "firstName": "Mireya",
  "lastName": "Armstrong",
  "username": "Fred32",
  "email": "Ayden9@hotmail.com",
  "address": {
    "country": "Germany",
    "city": "Berlin"
  },
  "createdAt": "2020-05-18T00:00:00.000Z",
  "updatedAt": "2021-05-18T05:17:48.493Z"
}
```

- Delete User
  **del** => if deleted successfully you will recieve a response of the user as an object, everything else will throw an error.

### /login

- Login User
  **post** => _to be updated_ => expects the following request =>

```
{
	"email": "the users email"
}
```

The response will be the user as an object.

## Books

All book calls start with /books

### /

- Add Book
  **post** => expects the following minimal request =>

```
{
	"title": "xmen",
	"subtitle": "The Big X",
	"authors": ["J. K. Rowling"],
	"publishedDate": 2002,
	"pages": 10,
	"shape": "good condition",
	"category": ["fantasy"],
	"selectedFiles": "file 03",
	"owner": "a valid user mongoose id"
}
```

_city will default to berlin_

you will recieve the following response: an object with "newBook": the book as an object && "addBookToUser": the user who is the owner of that book =>

```
{
  "newBook": {
    "authors": [
      "J. K. Rowling"
    ],
    "isbn": [],
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

### /:id

- Get Book
  **get** => will recieve a response as the book as an object

- Update one/many Fields In A Book
  **put** => please refer to user/:id put as it works mostly the same way. If updating an array with the request =>

```
{
	"isbn": "this item"
}
```

This will change the _whole array_ to be one item, the outcome will be =>

```
{
  "isnb" : ["this item"]
}
```

- Delete Book
  **del** => The reponse will be the book as an object.

### /user

- Add Interested User To Book
  **post** => This will happen on swiping to add an interested user. The expected request is the user id and book id =>

```
{
	"userId": "mongoose id",
	"bookId": "mongoose id"
}
```

The reponse will be the book as an object. _currently in the process of making a middleware that can stop the duplication of interested user, however right now you can add the same user to a book multiple times_

## Matches

Currently being created.
