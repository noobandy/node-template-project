/**
 * Created by anandm at 19-Feb-16
 */
var mongoose = require("mongoose");

var ToDoSchema = mongoose.Schema({}, {strict: false});

var ToDo = mongoose.model("ToDo", ToDoSchema);

module.exports = ToDo;