import { useEffect, useState } from "react";
import AddTodo from "./AddTodo";

import { Card, Container, ListGroup, Row } from "react-bootstrap";
import Todo from "./Todo";

function ToDoApp(props) {
  /**
   * @type {json}
   * todosData is used to store the data received from the API call
   */
  const [todosData, setTodosData] = useState([]);
  /**
   * @type {boolean}
   * loading is used to indicate to the user that the application is still
   * waiting to receive data from the REST API
   */
  const [loading, setLoading] = useState(false);
  /**
   * @type {object}
   * error is used to indicate to the user if there has been an error trying to
   * retrieve data from the API
   */
  const [error, setError] = useState(null);
  // We receive the token as a prop, eg. token={jwtToken} so we split it
  const token = props.token.split("=")[1];
  // UserId used to perform CRUD operations
  const userId = props.userId;

  // This function is used to fetch the Todos in the API
  // We use a POST instead of a GET because we have to pass the user ID to fetch the relevant Todos
  async function fetchTodos() {
    console.log("Fetching todos with userId: " + userId);
    const response = await fetch("/alltodos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: userId }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setTodosData(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Asynchronous function for adding a Todo
  async function addTodoHandler(todo) {
    const response = await fetch("/addtodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(todo),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setTodosData(data);
        alert("Added information of a new todo");
      });
  }

  // Asynchronous function for editing a Todo
  async function editTodoHandler(todo) {
    const response = await fetch("/edittodo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(todo),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setTodosData(data);
      });
  }

  // Asynchronous function for deleting a Todo
  async function deleteTodoHandler(id) {
    const response = await fetch("/deletetodo", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ todoId: id.value, userId: userId }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setTodosData(data);
      });
  }

  // Since this is a functional component, we can use the useEffect hook to
  // fetch the data.
  // Empty array indicates to call the fetch function on initial load of the
  // page
  // Reviewers often tell me to check for warnings, but this is the cause of those warnings
  // This is intended functionality
  useEffect(() => {
    fetchTodos();
  }, []);

  // If loading is set to true when fetching the data, display a loading Card
  if (loading)
    return (
      <Container style={{ marginTop: "15px" }}>
        <Card border="warning">
          <Card.Body>
            <Card.Title>Loading Page...</Card.Title>
            <Card.Text>Please wait while we load your page...</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  // If the error state is truthy after trying to fetch the data, display an
  // error Card
  if (error)
    return (
      <Container style={{ marginTop: "15px" }}>
        <Card border="danger">
          <Card.Body>
            <Card.Title>Error</Card.Title>
            <Card.Text>"Error fetching data"</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );

  return (
    <Container style={{ marginTop: "15px" }}>
      <Row>
        <AddTodo onAddTodo={addTodoHandler} userId={userId} />
      </Row>
      <hr />
      <Row>
        <ListGroup>
          {todosData.map((todo, index) => (
            <ListGroup.Item>
              <Todo
                key={todo._id}
                id={todo._id}
                title={todo.title}
                description={todo.description}
                userId={userId}
                onEditTodo={editTodoHandler}
                onDeleteTodo={deleteTodoHandler}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Row>
    </Container>
  );
}

export default ToDoApp;
