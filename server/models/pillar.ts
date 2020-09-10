// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const { Schema } = mongoose;

const pillarSchema = new Schema({
  name: { type: String, required: true },
});

// @ts-ignore
const pillar = (module.exports = mongoose.model('pillar', pillarSchema));

module.exports.get = (callback: any, limit: any) => {
  pillar.find(callback).limit(limit);
};
