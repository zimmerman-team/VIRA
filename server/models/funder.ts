// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const { Schema } = mongoose;

// @ts-ignore
const funderSchema = new Schema({
  name: { type: String, required: true },
});

// @ts-ignore
const funder = (module.exports = mongoose.model('funder', funderSchema));

module.exports.get = (callback: any, limit: any) => {
  funderSchema.find(callback).limit(limit);
};
