import React, { useRef, useState } from "react";
import { Button, Card, Form, Row } from "react-bootstrap";
import ToDoApp from "./ToDoApp";

// The Authentication Component Function.
// This component is used to display the login, signup, and Todo pages
function AuthComponent(props) {
  // This state is used to handle low level validation of the fields, i.e. blanks
  const [validated, setValidated] = useState(false);
  // This state is used to determine which page to show. We intially show the login page
  let [authMode, setAuthMode] = useState("login");
  // We use the useRef hooks below to help store the values the user inputs
  const userNameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  // The userId for the logged in user is saved in this state. The userId will be used to perform some CRUD operations
  const [userId, setUserId] = useState("");

  // Change between the login and signup pages
  const changeAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
  };

  // When a user completed the signup form and submits, save the information and save the user to the DB
  function signUp() {
    // Collect the user input values using the useRef hooks
    const userName = userNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // Create a Todo object with necesssary properties
    const user = {
      userName: userName,
      email: email,
      password: password,
    };
    // Send the object back to App.js to be used in adding the Todo
    addUserHandler(user);
  }

  // When a user completed the login form and submits, query the DB for the existence of that user in the DB
  function login() {
    // Collect the user input values using the useRef hooks
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // Create a Todo object with necesssary properties
    const user = {
      email: email,
      password: password,
    };
    // Send the object back to App.js to be used in adding the Todo
    logInHandler(user);
  }

  // Asynchronous function for adding a User
  async function addUserHandler(user) {
    const response = await fetch("/adduser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        // If the email/username already exists, the user was not added. Otherwise save the JWT token as a cookie
        if (!data.saved) {
          alert("That email/username already exists");
        } else {
          alert("New user saved");
          document.cookie = "token=" + data.token;
        }
      });
  }

  // Asynchronous function for Logging a User in to the App
  async function logInHandler(user) {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        // If the response was not ok, inform the user an incorrect email/password combination was entered
        alert(
          "Status: " +
            response.status +
            " " +
            response.statusText +
            "\nIncorrect email/password"
        );
      })
      .then((data) => {
        // If the user credentials were verified, save the JWT token as a cookie,
        // save the userId in a state and load the Todo page
        document.cookie = "token=" + data.token;
        setUserId(data.userId);
        setAuthMode("loggedIn");
      });
  }

  // This function handles the click of the submit button
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    // Stop the native HTML fucntionality of the form
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
    } else {
      // Depending on the page displayed, call the relevant function
      if (authMode === "signup") {
        signUp();
      } else if (authMode === "login") {
        login();
      }
    }
    // The form has been validated and Bootstrap can apply styling based on the Component attributes set in the form
    setValidated(true);
  };

  // If the user has logged in successfully, display the Todo application page
  if (authMode === "loggedIn") {
    return <ToDoApp token={document.cookie} userId={userId}></ToDoApp>;
  }

  // Display the login page
  if (authMode === "login") {
    return (
      <Card>
        <Card.Title
          className="ms-3 mt-3 me-3"
          style={{
            border: "1px solid grey",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>Sign In</h3>
          <div>
            Not Registered?{" "}
            <span
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={changeAuthMode}
            >
              Sign Up
            </span>
          </div>
        </Card.Title>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group controlId="signInValidationEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Email"
                  ref={emailRef}
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter a Valid Email
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group controlId="signInValidationPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Password"
                  required
                  ref={passwordRef}
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter a Password
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Button type="submit">Submit form</Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  // Display the sign in page
  return (
    <Card>
      <Card.Title
        className="ms-3 mt-3 me-3"
        style={{
          border: "1px solid grey",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <h3>Sign In</h3>
        <div>
          Already Registered?{" "}
          <span
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={changeAuthMode}
          >
            Sign In
          </span>
        </div>
      </Card.Title>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group controlId="signUpValidationEmail">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="John Doe"
                ref={userNameRef}
              />
              <Form.Control.Feedback type="invalid">
                Please fill in this field
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group controlId="signUpValidationEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Email Address"
                ref={emailRef}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group controlId="signUpValidationPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Password"
                required
                ref={passwordRef}
              />
              <Form.Control.Feedback type="invalid">
                Please fill in this field
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button type="submit">Submit form</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AuthComponent;
