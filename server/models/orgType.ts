// @ts-ignore
const mongoose = require('mongoose');
const OrgTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
});

// @ts-ignore
const orgType = (module.exports = mongoose.model('orgType', OrgTypeSchema));

module.exports.get = (callback: any, limit: any) => {
  orgType.find(callback).limit(limit);
};
