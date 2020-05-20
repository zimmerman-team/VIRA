// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const { Schema } = mongoose;
// @ts-ignore
const organisation = require('../models/Org');
// @ts-ignore
const category = require('../models/project_categroy');

const ProjectSchema = new mongoose.Schema({
  project_number: { type: String, required: true },
  project_name: { type: String, required: true },
  project_description: { type: String, required: false },
  duration: { type: String, required: false },
  start_date: { type: String, required: false },
  end_date: { type: String, required: false },
  total_amount: { type: Number, required: false },
  decision_date: { type: String, required: false },
  decision: { type: String, required: false },
  allocated_amount: { type: Number, required: false },
  released_amount: { type: Number, required: false },
  paid_amount: { type: Number, required: false },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: organisation,
    index: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: category,
    index: true,
  },
});

ProjectSchema.index({ '$**': 'text' });

// @ts-ignore
const project = (module.exports = mongoose.model('project', ProjectSchema));

module.exports.get = (callback: any, limit: any) => {
  project
    .find(callback)
    .populate({
      path: 'category',
      select: 'name',
    })
    .limit(limit);
};
