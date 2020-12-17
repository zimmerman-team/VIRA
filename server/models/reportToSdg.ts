// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const { Schema } = mongoose;
// @ts-ignore
const Sdg = require('../models/sdg');

const ReportToSdgSchema = new Schema({
  sdg: {
    type: Schema.Types.ObjectId,
    ref: Sdg,
    required: true,
  },
  weight: { type: Number, required: true },
});

// @ts-ignore
const reportToSdg = (module.exports = mongoose.model(
  'reportToSdg',
  ReportToSdgSchema
));

module.exports.get = (callback: any, limit: any) => {
  reportToSdg.find(callback).limit(limit);
};
