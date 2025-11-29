const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pollingStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PollingStation',
      required: true,
    },
    type: {
      type: String,
      enum: ['crowd_level', 'issue', 'observation', 'irregularity'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    status: {
      type: String,
      enum: ['reported', 'under_review', 'resolved', 'closed'],
      default: 'reported',
    },
    crowdLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    attachments: [String], // URLs to images or documents
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', ReportSchema);
