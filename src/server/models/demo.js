const mongoose = require('mongoose');

const { Schema } = mongoose;

const testDocSchema = new Schema({
  data: { type: 'String', required: true },
  words: [{
    type: String
  }],
  selectedWords: [{
    start: Number, end: Number, word: String, color: String
  }],
});


module.exports = mongoose.model('TestDoc', testDocSchema);
