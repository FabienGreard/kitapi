const mongoose = require('mongoose');

// Define engine schema
const EngineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  comments: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    trim: true,
    required: true,
  },
  level: {
    type: Number,
    default: 0
  },
  reserved: [
       {
           _id: false,
           from: String,
           Date: Date
       }
   ],
  },
  {
  timestamps: true
});

// Export Mongoose model
module.exports = mongoose.model('engine', EngineSchema);
