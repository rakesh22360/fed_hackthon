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
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide station capacity'],
      min: 1,
    },
    currentCrowdLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    votingHours: {
      startTime: {
        type: String,
        required: true,
        default: '7:00 AM',
      },
      endTime: {
        type: String,
        required: true,
        default: '6:00 PM',
      },
    },
    officialInCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    totalVoters: {
      type: Number,
      default: 0,
      min: 0,
    },
    votersTurnout: {
      type: Number,
      default: 0,
      min: 0,
    },
    contactNumber: {
      type: String,
      default: 'N/A',
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    lastCrowdLevelUpdate: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PollingStation', PollingStationSchema);
