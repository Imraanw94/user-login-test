import { useRef, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

// Todo Component
function Todo(props) {
  // We use the useRef hooks below to help store the values the user inputs
  const titleRef = useRef("");
  const descRef = useRef("");

  // This state is used to enable/disable the Title and Description fields
  const [disable, setDisable] = useState(true);
  // This state is used to enable/disable the Cancel button
  const [cancelDisable, setCancelDisable] = useState(true);
  // This state is used to set the component as editable or not
  const [edit, setEdit] = useState(false);
  // This state is used to change the edit button text
  const [editBtnText, setEditBtnText] = useState("Edit Todo");

  // This function handles editing the Todo
  function editTodoHandler() {
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
        id: props.id,
        title: title,
        description: description,
        user: props.userId,
      };

      // Send the object back to App.js to be used in editing the Todo
      props.onEditTodo(todo);
      setEdit(false);
    }
  }

  // Delete the todo using the ID of the todo
  function deleteTodoHandler() {
    props.onDeleteTodo({ value: props.id });
  }

  // This function is called when the user clicks the edit button
  function clickEditButtonHandler() {
    if (edit) {
      // If the fields are editable
      editTodoHandler();
      setEditBtnText("Edit Todo Info");
      setCancelDisable(true); // Disable the cancel button
      setDisable(true); // Make the fields disabled
    } else {
      // If the fields are not editable
      setEdit(true);
      setEditBtnText("Submit");
      setCancelDisable(false); // Enable the cancel button
      setDisable(false); // Make the fields editable
    }
  }

  // This function is called when the user clicks the delete button
  function clickDeleteButtonHandler() {
    // Display a confirmation alert asking the user to confirm deletion
    let confirmAction = window.confirm(
      "Are you sure you want to delete this Todo?"
    );
    if (confirmAction) {
      // If the user confirms, delete the todo
      deleteTodoHandler();
    }
  }

  // This function is called when the user clicks the cancel button
  function clickCancelButtonHandler() {
    setEdit(false); // Set the component as uneditable
    setEditBtnText("Edit Todo Info"); // Set the edit button text
    setCancelDisable(true); // Set the cancel button to disabled
    setDisable(true); // Disable the fields
  }

  // This function returns true if a string with only spaces is passed i.e. " "
  function onlySpaces(str) {
    return str.trim().length === 0;
  }

  return (
    <Card>
      <Card.Header></Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicModel">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              defaultValue={props.title}
              disabled={disable}
              ref={titleRef}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicMake">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              defaultValue={props.description}
              disabled={disable}
              ref={descRef}
            />
          </Form.Group>
        </Form>
        <Button
          className="me-3"
          variant="primary"
          onClick={clickEditButtonHandler}
        >
          {editBtnText}
        </Button>
        <Button
          className="me-3"
          variant="secondary"
          onClick={clickCancelButtonHandler}
          disabled={cancelDisable}
        >
          Cancel
        </Button>
        <Button variant="danger" onClick={clickDeleteButtonHandler}>
          Delete Todo
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Todo;
