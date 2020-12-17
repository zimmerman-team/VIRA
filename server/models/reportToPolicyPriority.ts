// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const { Schema } = mongoose;
// @ts-ignore
const PolicyPriority = require('../models/policyPriority');

const ReportToPolicyPrioritySchema = new Schema({
  policy_priority: {
    type: Schema.Types.ObjectId,
    ref: PolicyPriority,
    required: true,
  },
  weight: { type: Number, required: true },
});

// @ts-ignore
const reportToPolicyPriority = (module.exports = mongoose.model(
  'reportToPolicyPriority',
  ReportToPolicyPrioritySchema
));

module.exports.get = (callback: any, limit: any) => {
  reportToPolicyPriority.find(callback).limit(limit);
};
