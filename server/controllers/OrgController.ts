const organisation = require('../models/Org');

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
