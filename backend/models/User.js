const mongoose = require('mongoose');

// Transaction Schema
const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  rupees: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
  },
});

// Invited Friend Schema
const InvitedFriendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  reward: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
});

// Player Schema
const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  selectedBy: {
    type: String, // e.g., "31.93%"
  },
  points: {
    type: Number,
    default: 0,
  },
  credits: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  playedLastMatch: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
  },
});

// Match Details Schema (New)
const MatchDetailsSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
  },
  teams: {
    type: String,
    required: true,
  },
  teama_short: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  series: {
    type: String,
    required: true,
  },
  matchType: {
    type: String,
    required: true,
  },
  matchfile: {
    type: String,
    required: true,
  },
});

// Team Schema
const TeamSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  matchId: {
    type: String,
    required: true,
  },
  contestId: {
    type: Number,
    required: true,
  },
  selectedPlayers: [PlayerSchema],
  captain: {
    type: String,
    required: true,
  },
  viceCaptain: {
    type: String,
    required: true,
  },
  matchDetails: MatchDetailsSchema, // Embedded match details
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
  },
  skillScore: {
    type: Number,
    default: 0,
  },
  playingHistory: {
    contests: {
      type: Number,
      default: 0,
    },
    matches: {
      type: Number,
      default: 0,
    },
    series: {
      type: Number,
      default: 0,
    },
    sports: {
      type: Number,
      default: 0,
    },
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  address: {
    line1: {
      type: String,
    },
    line2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  totalBalance: {
    type: Number,
    default: 0,
  },
  winnings: {
    type: Number,
    default: 0,
  },
  transactionHistory: [TransactionSchema],
  invitedFriends: [InvitedFriendSchema],
  championsClub: {
    yourLevel: {
      type: String,
      default: 'beginner',
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  yourTeams: [TeamSchema], // Embedded team documents
  joinDate: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model
const User = mongoose.model('User', UserSchema);

// Export the model
module.exports = User;