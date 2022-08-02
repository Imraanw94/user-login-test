/* In this file, you will find all the code needed to perform CRUD operations using Mongoose. 
After performing any CRUD operation, we return an array of all the documents in the DB.
*/
const Todo = require("../models/todo.model.js");
var ObjectId = require("mongoose").Types.ObjectId;

exports.addTodo = async function (todo) {
  // Create and Save a new todo
  let todoModel = new Todo({
    title: todo.title,
    description: todo.description,
    author: todo.author,
  });
  const newTodo = await todoModel.save();

  const todos = await Todo.find({ author: new ObjectId(todo.author) });
  return todos;
};

// Get all the todo documents in the DB
exports.findAllTodos = async function (userId) {
  console.log("User ID is: " + userId);
  const todos = await Todo.find({ author: new ObjectId(userId) });
  console.log(todos);
  return todos;
};

// Update the todo by ID
exports.updateTodo = async function (todo) {
  let updatedTodo = await Todo.findByIdAndUpdate(todo.id, todo);

  const todos = await Todo.find({ author: new ObjectId(todo.author) });
  return todos;
};

// Delete a todo by ID
exports.deleteTodo = async function (todoId, authorId) {
  const todoToDelete = await Todo.findByIdAndDelete(todoId);

  const todos = await Todo.find({ author: new ObjectId(authorId) });
  return todos;
};
