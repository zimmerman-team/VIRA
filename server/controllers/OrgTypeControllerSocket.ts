const orgType = require('../models/orgType');

export function allOrgType(req: any, res: any) {
  orgType.get((err: any, org_type: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    } else {
      res(JSON.stringify(org_type));
    }
  });
}

// get one org_type

export function oneOrgType(req: any, res: any) {
  orgType.findById(req.query.id, (err: any, org_type: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }
    res(JSON.stringify(org_type));
  });
}

// add one org

export function addOrgType(req: any, res: any) {
  let org_type = new orgType();

  org_type.name = req.query.name;
  org_type.description = req.query.description;
  org_type.save((err: any, org_type: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }

    res(
      JSON.stringify({
        message: 'new organisation type created.',
        data: org_type,
      })
    );
  });
}

//update

export function UpdateOrgType(req: any, res: any) {
  orgType.findById(req.query.id, (err: any, found_orgType: any) => {
    if (err) {
      res.json(err);
    } else if (found_orgType) {
      found_orgType.name = req.query.name;
      found_orgType.description = req.query.description;
      found_orgType.save((err: any) => {
        if (err) {
          res(JSON.stringify({ status: 'error', message: err.message }));
        }

        res(JSON.stringify({ status: 'success', data: found_orgType }));
      });
    } else {
      res(
        JSON.stringify({
          status: 'fale',
          message: 'organisation type not found',
        })
      );
    }
  });
}

//delete

export function DelOrgType(req: any, res: any) {
  orgType.deleteOne(
    {
      _id: req.query.id,
    },
    (err: any, org_type: any) => {
      if (err) {
        res(JSON.stringify({ status: 'error', message: err.message }));
      } else {
        res(
          JSON.stringify({
            status:
              org_type.deletedCount + 'organisation type successfully deleted',
            message: org_type,
          })
        );
      }
    }
  );
}
