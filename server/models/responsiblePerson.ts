// @ts-ignore
const mongoose = require('mongoose');
const Organisation = require('../models/Org');
const PersonSchema = new mongoose.Schema({
  family_name: { type: String, required: true },
  initials: { type: String, required: false },
  name_insertion: { type: String, required: false },
  title: { type: String, required: false },
  email: { type: String, required: false },
  login_email: { type: String, required: false },
  sex: { type: String, required: false },
  role: { type: String, required: false },
  organisation: { type: mongoose.Schema.Types.ObjectId, ref: Organisation },
});

// @ts-ignore
const responsible_person = (module.exports = mongoose.model(
  'responsiblePerson',
  PersonSchema
));

module.exports.get = (callback: any, limit: any) => {
  responsible_person.find(callback).limit(limit);
};
