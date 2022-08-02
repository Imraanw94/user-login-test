// Include the express module
const express = require("express");

// Create an object by calling the express function
const app = express();
app.use(express.static("public"));
/* If we want our Express server to be able to access content that is passed 
in the body of the HTTP request, we need to include the body-parser middleware. 
The body-parser middleware extracts the entire body portion of an incoming 
request stream and exposes it on req.body.*/
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Get the todo.controller object to perform CRUD operations in index.js
const todoController = require("./controllers/todo.controller");
// Get the user.controller object to perform CRUD operations in index.js
const userController = require("./controllers/user.controller");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// To get the port number from the environment variables instead of hardcoding
// it, we use the following code:
const PORT = process.env.PORT || 3001;

const uri =
  "mongodb+srv://Imraan:" +
  process.env.MONGO_PW +
  "@imraan-first-cluster.gzwhi.mongodb.net/?retryWrites=true&w=majority";
// Connect to the DB using mongoose and start the node js app afterwards
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    app.listen(PORT, function () {
      console.log(`App listening on port ${PORT}!`);
    })
  )
  .catch((err) => console.log(err));

app.post("/login", (req, res) => {
  // Get the user's email and password from the body
  const userEmail = req.body.email;
  const pwd = req.body.password;
  // Use the controller to find the user with the given email and password combination
  const users = userController.findUser(userEmail, pwd).then((response) => {
    // If the frontend validation fails we can still return a 403
    if (response.length > 0) {
      // Use a payload to create a JWT token for the user login
      let payload = {
        email: response[0].email,
        username: response[0].username,
        loggedIn: true,
      };
      const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
        algorithm: "HS256",
      });
      // Return the JWT token, a boolean that the user is logged in, and the user's ID
      res.send({ token: token, loggedIn: true, userId: response[0]._id });
    } else {
      res.status(403).send({ err: "Incorrect login!" });
    }
  });
});

// Route handler to POST and add a user
app.post("/adduser", (req, res) => {
  // Create a user object from the body
  const user = {
    username: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  };
  // Use the controller to add the user object.
  const users = userController.addUser(user).then((response) => {
    // The responseToFront object is the response we would send to the front end
    // It will contain the token and a boolean of if the user was added successfully
    let responseToFront = {};
    if (response.saved) {
      const token = jwt.sign(JSON.stringify(user), "jwt-secret", {
        algorithm: "HS256",
      });
      responseToFront = {
        saved: response.saved,
        token: token,
      };
    } else {
      responseToFront = {
        saved: response.saved,
      };
    }
    res.send(responseToFront);
  });
});

// Route handler to POST all the todos
app.post("/alltodos", function (req, res) {
  // First extract the toke nfrom the header
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    // Decode the JWT token to verify it.
    const decoded = jwt.verify(token, "jwt-secret");

    // If the token is verified with no errors caught
    // Extract the user's ID and get all todos made by that user
    const user = req.body.userId;
    const todos = todoController.findAllTodos(user).then((response) => {
      res.send(response);
    });
  } catch (err) {
    res.status(401).send({ err: "Bad JWT!" });
  }
});

// Route handler to POST and add a todo
app.post("/addtodo", (req, res) => {
  // First extract the toke nfrom the header
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    // Decode the JWT token to verify it.
    const decoded = jwt.verify(token, "jwt-secret");

    // If the token is verified with no errors caught
    // Create a todo object and add it to the DB
    const todo = {
      title: req.body.title,
      description: req.body.description,
      author: req.body.user,
    };
    const todos = todoController.addTodo(todo).then((response) => {
      res.send(response);
    });
  } catch (err) {
    res.status(401).send({ err: "Bad JWT!" });
  }
});

// Route handler to DELETE and remove a todo
app.delete("/deletetodo", (req, res) => {
  // First extract the toke nfrom the header
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    // Decode the JWT token to verify it.
    const decoded = jwt.verify(token, "jwt-secret");

    // If the token is verified with no errors caught
    // Delete the todo using the todo's ID and the user's ID
    const todos = todoController
      .deleteTodo(req.body.todoId, req.body.userId)
      .then((response) => {
        res.send(response);
      });
  } catch (err) {
    res.status(401).send({ err: "Bad JWT!" });
  }
});

// Route handler to PUT and edit a todo
app.put("/edittodo", (req, res) => {
  // First extract the toke nfrom the header
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    // Decode the JWT token to verify it.
    const decoded = jwt.verify(token, "jwt-secret");

    // If the token is verified with no errors caught
    // Create a todo object from the body values and update it in the DB
    const todo = {
      id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      author: req.body.user,
    };

    const todos = todoController.updateTodo(todo).then((response) => {
      res.send(response);
    });
  } catch (err) {
    res.status(401).send({ err: "Bad JWT!" });
  }
});

// Route handler if the user enters an unknown path
app.get("*", function (req, res, next) {
  // Error object with error message
  let err = new Error("Sorry! Can't find that resource. Please check your URL");
  err.statusCode = 404; // Error status code
  // Display the error message on the web page
  res.status(err.statusCode).send(err.message);
});
