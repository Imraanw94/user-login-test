import { useRef } from "react";
import { Button, Card, Form } from "react-bootstrap";

// Add Todo Component
function AddTodo(props) {
  // We use the useRef hooks below to help store the values the user inputs
  const titleRef = useRef("");
  const descRef = useRef("");

  // With this function we collect the user inputs and add the todo
  function addTodoHandler(event) {
    // Collect the user input values using the useRef hooks
    const title = titleRef.current.value;
    const description = descRef.current.value;

    // Simple validation disallowing empty strings
    if (
      !title ||
      onlySpaces(title) ||
      !description ||
      onlySpaces(description)
    ) {
      alert("All fields must not be empty");
    } else {
      // Create a Todo object with necesssary properties
      const todo = {
        title: title,
        description: description,
        user: props.userId,
      };
      // Send the object back to App.js to be used in adding the Todo
      props.onAddTodo(todo);
    }
  }

  // This function returns true if a string with only spaces is passed i.e. " "
  function onlySpaces(str) {
    return str.trim().length === 0;
  }

  return (
    <Card>
      <Card.Header>Add a new Task</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the title of your task"
              ref={titleRef}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a description of your task"
              ref={descRef}
            />
          </Form.Group>
          <Button variant="primary" type="button" onClick={addTodoHandler}>
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AddTodo;
