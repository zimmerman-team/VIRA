// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const { Schema } = mongoose;

const targetBeneficiarySchema = new Schema({
  name: { type: String, required: true },
  value: { type: Number, default: 0, required: true },
});

// @ts-ignore
const targetBeneficiary = (module.exports = mongoose.model(
  'targetBeneficiary',
  targetBeneficiarySchema
));

module.exports.get = (callback: any, limit: any) => {
  targetBeneficiary.find(callback).limit(limit);
};
