const mongoose = require('mongoose');

const PollingStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a station name'],
      trim: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      latitude: Number,
      longitude: Number,
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide station capacity'],
    },
    currentCrowdLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    votingHours: {
      startTime: String,
      endTime: String,
    },
    officialInCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    totalVoters: {
      type: Number,
      default: 0,
    },
    votersTurnout: {
      type: Number,
      default: 0,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PollingStation', PollingStationSchema);
