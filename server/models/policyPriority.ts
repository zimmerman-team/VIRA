// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const { Schema } = mongoose;

const policyPrioritySchema = new Schema({
  name: { type: String, required: true },
});

// @ts-ignore
const policyPriority = (module.exports = mongoose.model(
  'policyPriority',
  policyPrioritySchema
));

module.exports.get = (callback: any, limit: any) => {
  policyPriority.find(callback).limit(limit);
};
