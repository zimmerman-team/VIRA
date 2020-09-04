// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const { Schema } = mongoose;

const sdgSchema = new Schema({
  code: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
});

// @ts-ignore
const sdg = (module.exports = mongoose.model('sdg', sdgSchema));

module.exports.get = (callback: any, limit: any) => {
  sdg.find(callback).limit(limit);
};
