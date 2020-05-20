// @ts-ignore
const mongoose = require('mongoose');
const org_type = require('../models/orgType');
// @ts-ignore
const { Schema } = mongoose;

const OrgSchema = new Schema({
  organisation_name: { type: String, required: true },
  org_type: { type: Schema.Types.ObjectId, ref: org_type, index: true },
  street: { type: String, required: false },
  house_number: { type: String, required: false },
  additional_house_number: { type: String, required: false },
  postcode: { type: String, required: false },
  place: { type: String, required: false },
  country: { type: String, required: false },
  telephone: { type: String, required: false },
  email: { type: String, required: false },
  website: { type: String, required: false },
});

OrgSchema.index({ '$**': 'text' });

// @ts-ignore
const organisation = (module.exports = mongoose.model(
  'organisation',
  OrgSchema
));

module.exports.get = (callback: any, limit: any) => {
  organisation
    .find(callback)
    .populate('org_type', 'name')
    .limit(limit);
};
