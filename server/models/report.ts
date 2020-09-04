require('dotenv').config();
// @ts-ignore
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
// @ts-ignore
const targetBeneficiary = require('../models/targetBeneficiary');
// @ts-ignore
const reportToPolicyPriority = require('../models/reportToPolicyPriority');
// @ts-ignore
const pillar = require('../models/pillar');
// @ts-ignore
const funderSchema = require('../models/funder');
// @ts-ignore
const location = require('../models/location');
// @ts-ignore
const project = require('../models/project');
// @ts-ignore
const reportToSdg = require('../models/reportToSdg');
// @ts-ignore
const { Schema } = mongoose;

var connection = mongoose.createConnection(process.env.REACT_APP_MONGO_DB_URL);
autoIncrement.initialize(connection);

function parseToString(date_new: Date) {
  if (date_new) {
    return date_new.toISOString().substring(0, 10);
  } else {
    return 'No new date';
  }
}

const ReportSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  date_new: { type: Date, default: Date.now, get: parseToString },
  location: {
    type: Schema.Types.ObjectId,
    ref: location,
    index: true,
    required: false,
  },
  country: { type: String, required: true },
  total_target_beneficiaries: { type: Number, default: 0, required: true },
  target_beneficiaries: [
    { type: Schema.Types.ObjectId, ref: targetBeneficiary, index: true },
  ],
  total_target_beneficiaries_commited: {
    type: Number,
    default: 0,
    required: false,
  },
  project: { type: Schema.Types.ObjectId, ref: project, index: true },
  media: [{ type: String, required: false }],
  policy_priorities: [
    {
      type: Schema.Types.ObjectId,
      ref: reportToPolicyPriority,
      required: false,
    },
  ],
  sdgs: [
    {
      type: Schema.Types.ObjectId,
      ref: reportToSdg,
      required: false,
    },
  ],
  pillar: {
    type: Schema.Types.ObjectId,
    ref: pillar,
    required: false,
  },
  budget: { type: Number, required: true },
  insContribution: { type: Number, required: true },
  reportID: { type: Number, required: true },
  place_name: { type: String, required: false },
  isDraft: { type: Boolean, default: false, required: true },
  funders: [{ type: Schema.Types.ObjectId, ref: funderSchema }],
  key_outcomes: { type: String, required: true },
  monitor_report_outcomes: { type: String, required: true },
  inputs_invested: { type: String, required: true },
  activities_undertaken: { type: String, required: true },
  projectgoals_socialbenefits: { type: String, required: true },
  important_factors: { type: String, required: true },
  orgs_partners: { type: String, required: true },
  key_implementation_challenges: { type: String, required: true },
  how_address_challenges: { type: String, required: true },
  other_project_outcomes: { type: String, required: true },
  how_important_insinger_support: { type: String, required: true },
  apply_for_more_funding: { type: String, required: true },
  other_comments: { type: String, required: true },
  plans: { type: String, required: false },
});

ReportSchema.plugin(autoIncrement.plugin, {
  model: 'report',
  field: 'reportID',
  startAt: 1000,
});

ReportSchema.index({ '$**': 'text' });

const report = (module.exports = mongoose.model('report', ReportSchema));

module.exports.get = (callback: any, limit: any) => {
  report
    .find(callback)
    .populate('location')
    .populate('project')
    .populate('policy_priorities')
    .populate('sdgs')
    .populate({
      path: 'pillar',
      select: 'name',
    })
    .populate({
      path: 'target_beneficiaries',
      select: 'name',
    })
    .populate({
      path: 'funders',
      select: 'name',
    })
    .limit(limit);
};
