// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const { Schema } = mongoose;

const locationSchema = new Schema({
  long: { type: Number, required: true },
  lat: { type: Number, required: true },
});

// @ts-ignore
const location = (module.exports = mongoose.model(
  'locationSchema',
  locationSchema
));

module.exports.get = (callback: any, limit: any) => {
  locationSchema.find(callback).limit(limit);
};
