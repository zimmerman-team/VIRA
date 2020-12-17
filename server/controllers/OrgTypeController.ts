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

export function oneOrgType(req: any, res: any) {
  orgType.findById(req.params._id, (err: any, org_type: any) => {
    if (err) {
      res.send(err);
    }
    res.json({ data: org_type });
  });
}
