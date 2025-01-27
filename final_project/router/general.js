const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// TASK 10 - Get the book list available in the shop using Promises
public_users.get('/',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
  // Send a JSON response containing the books array, formatted with an indentation of 4 spaces for readability
    resolve(res.send(JSON.stringify((books),null,4)));
    });
    get_books.then(() => console.log("Promise for Task 10 resolved"));
 });

// TASK 11 - Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
  resolve(res.send(books[isbn]));
    });
    get_books_isbn.then(() => console.log("Promise for Task 11 resolved"));
 });
  
// TASK 12 - Get book details based on author using Promises
public_users.get('/books/author/:author',function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }
    });
    reject(res.send("The mentioned author does not exist "))    
    });
    get_books_author.then(function(){
            console.log("Promise for Task 12 is resolved");
   }).catch(function () { 
                console.log('The mentioned author does not exist');
  });
});

// TASK 13 - Get all books based on title using Promises
public_users.get('/title/:title',function (req, res) {
    const get_books_title = new Promise((resolve, reject) => {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn": isbn,
          "author": books[isbn]["author"],
          "reviews": books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
    }
   });
   reject(res.send("The mentioned title does not exist "))    
});
get_books_title.then(function(){
        console.log("Promise for Task 13 is resolved");
    }).catch(function () { 
            console.log('The mentioned title does not exist');
    });        
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
