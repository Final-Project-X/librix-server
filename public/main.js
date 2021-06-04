const userSchema = document.getElementById('user-schema');
const codeArrOne = [
  `"username": "username",`,
  `"email": "email",`,
  `"passowrd": "password",`,
  `"city": "city",`,
];
const codeArrOneOptional = [
  `"aboutMe": "aboutMe",`,
  `"avatar": png / defualt is provided,`,
  `"points": number / defualt 0,`,
  `"booksToOffer": [objectIDs],`,
  `"booksToRemember": [objectIDs],`,
  `"booksInterestedIn": [objectIDs],`,
  `"matches": [objectIDs],`,
  `"createdAt": date,`,
  `"updatedAt": date`,
];

//userSchema.innerHTML = <p>i am some text</p>;
const insertCodeToUserSchema = () => {
  userSchema.innerHTML += `<div>{</div>`;
  for (let i = 0; i < codeArrOne.length; i++) {
    userSchema.innerHTML += `<div class="code">${codeArrOne[i]}</div>`;
  }
  for (let i = 0; i < codeArrOneOptional.length; i++) {
    userSchema.innerHTML += `<div class="code-optional">${codeArrOneOptional[i]}</div>`;
  }
  userSchema.innerHTML += `<div>}</div>`;
};

insertCodeToUserSchema();
