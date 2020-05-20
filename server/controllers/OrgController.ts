const organisation = require('../models/Org');
const orgType = require('../models/orgType');

export function allOrg(req: any, res: any) {
  organisation.get((err: any, org: any) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    }
    res.json({
      data: org,
    });
  });
}

export function oneOrg(req: any, res: any) {
  organisation
    .findById(req.params._id)
    .populate('org_type', 'name')
    .exec((err: any, org: any) => {
      if (err) {
        res.send(err);
      }
      res.json({ data: org });
    });
}

export function AddOrg(req: any, res: any) {
  orgType.findOne({ name: req.body.org_type }, (err: any, orgType: any) => {
    if (!orgType) {
      let org = new organisation();
      org.organisation_name = req.body.organisation_name;
      org.street = req.body.street;
      org.house_number = req.body.house_number;
      org.additional_house_number = req.body.additional_house_number;
      org.postcode = req.body.postcode;
      org.place = req.body.place;
      org.country = req.body.country;
      org.email = req.body.email;
      org.website = req.body.website;
      //save organisation.
      org.save((err: any) => {
        if (err) {
          res.json(err);
        }
        res.json({
          message: 'new organisation successfully created.',
          data: org,
        });
      });
    } else if (orgType) {
      let org = new organisation();
      org.organisation_name = req.body.organisation_name;
      org.street = req.body.street;
      org.org_type = orgType;
      org.house_number = req.body.house_number;
      org.additional_house_number = req.body.additional_house_number;
      org.postcode = req.body.postcode;
      org.place = req.body.place;
      org.country = req.body.country;
      org.email = req.body.email;
      org.website = req.body.website;
      //save organisation.
      org.save((err: any) => {
        if (err) {
          res.json(err);
        }
        res.json({
          message: 'new organisation successfully created.',
          data: org,
        });
      });
    }
  });
}

//update

export function UpdateOrg(req: any, res: any) {
  organisation.findById(req.params._id, (err: any, found_org: any) => {
    if (err) {
      res.json(err);
    } else if (found_org) {
      found_org.organisation_name = req.body.organisation_name;
      found_org.street = req.body.street;
      found_org.house_number = req.body.house_number;
      found_org.additional_house_number = req.body.additional_house_number;
      found_org.postcode = req.body.postcode;
      found_org.place = req.body.place;
      found_org.country = req.body.country;
      found_org.email = req.body.email;
      found_org.website = req.body.website;

      found_org.save((err: any) => {
        if (err) {
          res.json(err);
        } else {
          orgType.findOne({ name: req.body.org_type }, (err: any, org: any) => {
            if (org) {
              found_org.organisation_name = req.body.organisation_name;
              found_org.street = req.body.street;
              found_org.house_number = req.body.house_number;
              found_org.additional_house_number =
                req.body.additional_house_number;
              found_org.postcode = req.body.postcode;
              found_org.place = req.body.place;
              found_org.country = req.body.country;
              found_org.email = req.body.email;
              found_org.website = req.body.website;
              found_org.org_type = req.body.org_type;

              found_org.save();
            }
            res.json({
              status: 'success',
              data: found_org,
            });
          });
        }
      });
    } else {
      res.json({
        status: 'fail',
        message: 'organisation not found.',
      });
    }
  });
}

//delete

export function DelOrg(req: any, res: any) {
  organisation.deleteOne(
    {
      _id: req.params._id,
    },
    (err: any, org: any) => {
      if (err) {
        res.json(err);
      } else {
        res.json({
          status: org.deletedCount + ' organisation successfully deleted.',
          message: org,
        });
      }
    }
  );
}
