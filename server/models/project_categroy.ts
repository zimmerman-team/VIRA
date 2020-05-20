// @ts-ignore
const mongoose = require('mongoose');
//const { Schema } = mongoose;
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
});

const projectCategory = (module.exports = mongoose.model(
  'projectCategory',
  CategorySchema
));

module.exports.get = (callback: any, limit: any) => {
  projectCategory.find(callback).limit(limit);
};
