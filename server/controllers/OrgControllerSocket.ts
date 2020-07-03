import get from 'lodash/get';
import consts from '../config/consts';
const orgType = require('../models/orgType');
const organisation = require('../models/Org');
const ResponsiblePerson = require('../models/responsiblePerson');

export function allOrg(req: any, res: any) {
  if (!req.query.id) {
    if (
      get(req.query, 'userRole', '').toLowerCase() !==
      consts.roles.superAdm.toLowerCase()
    ) {
      ResponsiblePerson.find(
        { email: req.query.userEmail },
        (err: any, persons: any) => {
          organisation.find(
            { _id: { $in: persons.map((p: any) => p.organisation) } },
            (err: any, orgs: any) => {
              res(JSON.stringify({ data: orgs }));
            }
          );
        }
      );
    } else {
      organisation.get((err: any, org: any) => {
        if (err) {
          res(JSON.stringify({ status: 'error', message: err.message }));
        }
        res(JSON.stringify({ data: org }));
      });
    }
  } else {
    organisation.findById(req.query.id, (err: any, org: any) => {
      organisation.populate(
        org,
        {
          path: 'org_type ',
          select: 'name ', //org_type name
        },
        (err: any, org: any) => {
          if (err) {
            res(JSON.stringify({ status: 'error', message: err.message }));
          }
          res(JSON.stringify({ data: org }));
        }
      );
    });
  }
}

export function oneOrg(req: any, res: any) {
  organisation
    .findById(req.query.id)
    .populate('org_type', 'name')
    .exec((err: any, org: any) => {
      if (err) {
        res(JSON.stringify({ status: 'error', message: err.message }));
      }
      res(JSON.stringify({ data: org }));
    });
}

export function AddOrg(req: any, res: any) {
  orgType.findOne({ name: req.query.org_type }, (err: any, orgType: any) => {
    if (!orgType) {
      let org = new organisation();
      org.organisation_name = req.query.organisation_name;
      org.street = req.query.street;
      org.house_number = req.query.house_number;
      org.additional_house_number = req.query.additional_house_number;
      org.postcode = req.query.postcode;
      org.place = req.query.place;
      org.country = req.query.country;
      org.email = req.query.email;
      org.website = req.query.website;
      //save organisation.
      org.save((err: any) => {
        if (err) {
          res(JSON.stringify({ status: 'error', message: err.message }));
        }
        res(
          JSON.stringify({
            message: 'new organisation successfully created.',
            data: org,
          })
        );
      });
    } else if (orgType) {
      let org = new organisation();
      org.organisation_name = req.query.organisation_name;
      org.street = req.query.street;
      org.org_type = orgType;
      org.house_number = req.query.house_number;
      org.additional_house_number = req.query.additional_house_number;
      org.postcode = req.query.postcode;
      org.place = req.query.place;
      org.country = req.query.country;
      org.email = req.query.email;
      org.website = req.query.website;
      //save organisation.
      org.save((err: any) => {
        if (err) {
          res(JSON.stringify({ status: 'error', message: err.message }));
        }

        res(
          JSON.stringify({
            message: 'new organisation successfully created.',
            data: org,
          })
        );
      });
    }
  });
}

//update

export function UpdateOrg(req: any, res: any) {
  organisation.findById(req.query.id, (err: any, found_org: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    } else if (found_org) {
      found_org.organisation_name = req.query.organisation_name;
      found_org.street = req.query.street;
      found_org.house_number = req.query.house_number;
      found_org.additional_house_number = req.query.additional_house_number;
      found_org.postcode = req.query.postcode;
      found_org.place = req.query.place;
      found_org.country = req.query.country;
      found_org.email = req.query.email;
      found_org.website = req.query.website;

      found_org.save((err: any) => {
        if (err) {
          res(JSON.stringify({ status: 'error', message: err.message }));
        } else {
          orgType.findOne(
            { name: req.query.org_type },
            (err: any, org: any) => {
              if (org) {
                found_org.organisation_name = req.body.organisation_name;
                found_org.street = req.query.street;
                found_org.house_number = req.query.house_number;
                found_org.additional_house_number =
                  req.query.additional_house_number;
                found_org.postcode = req.query.postcode;
                found_org.place = req.query.place;
                found_org.country = req.query.country;
                found_org.email = req.query.email;
                found_org.website = req.query.website;
                found_org.org_type = req.query.org_type;

                found_org.save();
              }

              res(
                JSON.stringify({
                  message: 'an organisation is successfully updated.',
                  data: found_org,
                })
              );
            }
          );
        }
      });
    } else {
      res(
        JSON.stringify({ status: 'fail', message: 'organisation not found.' })
      );
    }
  });
}

//delete

export function DelOrg(req: any, res: any) {
  organisation.deleteOne(
    {
      _id: req.query.id,
    },
    (err: any, org: any) => {
      if (err) {
        res.json(err);
      } else {
        res(
          JSON.stringify({
            status: org.deletedCount + ' org successfully deleted',
            message: org,
          })
        );
      }
    }
  );
}
