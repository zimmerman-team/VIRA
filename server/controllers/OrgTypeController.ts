const orgType = require('../models/orgType');

export function allOrgType(req: any, res: any) {
  orgType.get((err: any, org_type: any) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    }
    res.json({
      data: org_type,
    });
  });
}

// get one org_type

export function oneOrgType(req: any, res: any) {
  orgType.findById(req.params._id, (err: any, org_type: any) => {
    if (err) {
      res.send(err);
    }
    res.json({ data: org_type });
  });
}

// add one org

export function addOrgType(req: any, res: any) {
  let org_type = new orgType();

  org_type.name = req.body.name;
  org_type.description = req.body.description;
  org_type.save((err: any, org_type: any) => {
    if (err) {
      res.send(err);
    }
    res.json({
      message: 'new organisation type created.',
      data: org_type,
    });
  });
}

//update

export function UpdateOrgType(req: any, res: any) {
  orgType.findById(req.params._id, (err: any, found_orgType: any) => {
    if (err) {
      res.json(err);
    } else if (found_orgType) {
      found_orgType.name = req.body.name;
      found_orgType.description = req.body.description;
      found_orgType.save((err: any) => {
        if (err) {
          res.json(err);
        }
        res.json({
          status: 'success',
          data: found_orgType,
        });
      });
    } else {
      res.json({
        status: 'fail',
        message: 'organisation type not found.',
      });
    }
  });
}

//delete

export function DelOrgType(req: any, res: any) {
  orgType.deleteOne(
    {
      _id: req.params._id,
    },
    (err: any, org_type: any) => {
      if (err) {
        res.json(err);
      } else {
        res.json({
          status:
            org_type.deletedCount + ' organisation type successfully deleted.',
          message: org_type,
        });
      }
    }
  );
}
