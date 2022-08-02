// Boilerplate CRUD operations for a controller
const User = require("../models/user.model.js");

exports.addUser = async function (user) {
  // Create and Save a new user
  let userModel = new User({
    username: user.username,
    email: user.email,
    password: user.password,
  });
  let response = {
    saved: false,
  };
  // If the response is not saved return false to display appropriate error messages on the frontend
  try {
    let newUser = await userModel.save();
    response.saved = true;
    if (res) return response;
  } catch (error) {
    return response;
  }
};

// Get all the user document in the DB
exports.findUser = async function (email, password) {
  const user = await User.find({ email: email, password: password });
  return user;
};

// Update the user by ID
exports.updateUser = async function (user) {
  let updatedUser = await User.findByIdAndUpdate(user.id, user);

  const users = await User.find({});
  return users;
};

// Delete a user by ID
exports.deleteUser = async function (id) {
  const userToDelete = await User.findByIdAndDelete(id);

  const users = await User.find({});
  return users;
};
