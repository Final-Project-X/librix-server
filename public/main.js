const userSchema = document.getElementById('userSchema');
const bookSchema = document.getElementById('bookSchema');
const matchSchema = document.getElementById('matchSchema');

const insertCodeToUserSchema = (schema, codeArr, codeArrOptional) => {
  schema.innerHTML += `<div>{</div>`;

  for (let i = 0; i < codeArr.length; i++) {
    schema.innerHTML += `<div class="code">${codeArr[i]}</div>`;
  }

  if (codeArrOptional.length > 0) {
    for (let i = 0; i < codeArrOptional.length; i++) {
      schema.innerHTML += `<div class="code-optional">${codeArrOptional[i]}</div>`;
    }
  }

  schema.innerHTML += `<div>}</div>`;
};

const codeArrUser = [
  `"username": string,`,
  `"email": string,`,
  `"passowrd": string,`,
  `"city": string,`,
];

const codeArrUserOptional = [
  `"aboutMe": string,`,
  `"avatar": png / defualt is provided,`,
  `"points": number / defualt 0,`,
  `"booksToOffer": [objectIDs],`,
  `"booksToRemember": [objectIDs],`,
  `"booksInterestedIn": [objectIDs],`,
  `"matches": [objectIDs],`,
  `"createdAt": date,`,
  `"updatedAt": date`,
];

const codeArrBook = [
  `"username": string,`,
  `"email": string,`,
  `"passowrd": string,`,
  `"city": string,`,
];

const codeArrBookOptional = [
  `"aboutMe": string,`,
  `"avatar": png / defualt is provided,`,
  `"points": number / defualt 0,`,
  `"booksToOffer": [objectIDs],`,
  `"booksToRemember": [objectIDs],`,
  `"booksInterestedIn": [objectIDs],`,
  `"matches": [objectIDs],`,
  `"createdAt": date,`,
  `"updatedAt": date`,
];

const codeArrMatch = [
  `"username": string,`,
  `"email": string,`,
  `"passowrd": string,`,
  `"city": string,`,
];

const codeArrMatchOptional = [
  `"aboutMe": string,`,
  `"avatar": png / defualt is provided,`,
  `"points": number / defualt 0,`,
  `"booksToOffer": [objectIDs],`,
  `"booksToRemember": [objectIDs],`,
  `"booksInterestedIn": [objectIDs],`,
  `"matches": [objectIDs],`,
  `"createdAt": date,`,
  `"updatedAt": date`,
];

insertCodeToUserSchema(userSchema, codeArrUser, codeArrUserOptional);
insertCodeToUserSchema(bookSchema, codeArrBook, codeArrBookOptional);
insertCodeToUserSchema(matchSchema, codeArrMatch, codeArrMatchOptional);
