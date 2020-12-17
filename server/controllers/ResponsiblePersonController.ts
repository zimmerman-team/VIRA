const responsible_person = require('../models/responsiblePerson');

export function allPerson(req: any, res: any) {
  responsible_person.get((err: any, person: any) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    }
    responsible_person.populate(
      person,
      {
        path: 'organisation',
        select: 'organisation_name ', //org name
        match: req.query.hasOwnProperty('organisation_name')
          ? {
              organisation_name: {
                $in: req.query.organisation_name.split(','),
              },
            }
          : {},
      },
      (err2: any, data: any) => {
        res.json({
          data: data.filter((project: any) => {
            return project.organisation != null;
          }),
        });
      }
    );
  });
}

//one person

export function onePeron(req: any, res: any) {
  responsible_person
    .findById(req.params._id)
    .populate({
      path: 'organisation',
      select: 'organisation_name',
    })
    .exec((err: any, org: any) => {
      if (err) {
        res.send(err);
      }
      res.json({ data: org });
    });
}
