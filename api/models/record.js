const mongoose = require('mongoose');

// Define record schema
const RecordSchema = new mongoose.Schema({
  from: String,
  dateStart: Date,
  dateEnd: Date
  },
  {
  timestamps: false
});

// Export Mongoose model
module.exports = mongoose.model('record', RecordSchema);
