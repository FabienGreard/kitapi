const mongoose = require('mongoose');

// Define record schema
const RecordSchema = new mongoose.Schema({
  from: String,
  Engine: String,
  dateStart: Date,
  dateEnd: Date,
  Status: {
    type: String,
    enum: ['Waiting', 'Accept', 'Cancel'],
    default: 'Waiting'
  },
  },
  {
  timestamps: false
});

// Export Mongoose model
module.exports = mongoose.model('record', RecordSchema);
