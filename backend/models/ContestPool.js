const mongoose = require('mongoose');

// Contest Participant Schema
const ContestParticipantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
  playstatus: {
    type: String,  // Missing 'type'
    enum: ['lose', 'win', 'none'],  // Fixed syntax error in enum
    default: 'none',
  },
  winamount: {
    type: Number,  // Added 'type' for winamount
    default: 0,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

// Contest Pool Schema
const ContestPoolSchema = new mongoose.Schema({
  contestId: {
    type: Number,
    required: true,
    unique: true,
  },
  matchId: {
    type: String,
    required: true,
  },
  prizePool: {
    type: Number,
    required: true,
  },
  entryFee: {
    type: Number,
    required: true,
  },
  originalFee: {
    type: Number,
    required: true,
  },
  totalSpots: {
    type: Number,
    required: true,
  },
  spotsLeft: {
    type: Number,
    required: true,
  },
  additionalPrize: {
    type: String,
    default: '',  // Added default value to prevent undefined
  },
  maxEntriesPerUser: {
    type: Number,
    required: true,
  },
  participants: [ContestParticipantSchema],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  link: {
    type: String,
    required: true,
  },
});

const ContestPool = mongoose.model('ContestPool', ContestPoolSchema);
module.exports = ContestPool;
