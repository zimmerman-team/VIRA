const responsible_person = require('../models/responsiblePerson');
const organisation = require('../models/Org');

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
      (err: any, data: any) => {
        res.json({
          data: data.filter((projects: any) => {
            return projects.organisation != null;
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

//add responsible person

export function AddPerson(req: any, res: any) {
  organisation.findOne(
    { organisation_name: req.body.organisation },
    (err: any, org: any) => {
      if (!org) {
        let person = new responsible_person();
        person.family_name = req.body.family_name;
        person.initials = req.body.initials;
        person.name_insertion = req.body.name_insertion;
        person.title = req.body.title;
        person.email = req.body.email;
        person.login_email = req.body.login_email;
        person.sex = req.body.sex;
        person.role = req.body.role;
        person.organisation = null;
        //save person.
        person.save((err: any) => {
          if (err) {
            res.json(err);
          }
          res.json({
            message: 'a new responsible person successfully created.',
            data: person,
          });
        });
      } else if (org) {
        let person = new responsible_person();
        person.family_name = req.body.family_name;
        person.initials = req.body.initials;
        person.name_insertion = req.body.name_insertion;
        person.title = req.body.title;
        person.email = req.body.email;
        person.login_email = req.body.login_email;
        person.sex = req.body.sex;
        person.role = req.body.role;
        person.organisation = org;
        //save person.
        person.save((err: any) => {
          if (err) {
            res.json(err);
          }
          res.json({
            message: 'a new responsible person successfully created.',
            data: person,
          });
        });
      }
    }
  );
}

//update

export function UpdatePerson(req: any, res: any) {
  responsible_person.findById(req.params._id, (err: any, found_person: any) => {
    if (err) {
      res.json(err);
    } else if (found_person) {
      found_person.family_name = req.body.family_name;
      found_person.initials = req.body.initials;
      found_person.name_insertion = req.body.name_insertion;
      found_person.title = req.body.title;
      found_person.email = req.body.email;
      found_person.login_email = req.body.login_email;
      found_person.sex = req.body.sex;
      found_person.role = req.body.role;

      found_person.save((err: any, person: any) => {
        if (err) {
          res.json(err);
        } else {
          organisation.findOne(
            { organisation_name: req.body.organisation },
            (err: any, org: any) => {
              if (org) {
                found_person.family_name = req.body.family_name;
                found_person.initials = req.body.initials;
                found_person.name_insertion = req.body.name_insertion;
                found_person.title = req.body.title;
                found_person.email = req.body.email;
                found_person.login_email = req.body.login_email;
                found_person.sex = req.body.sex;
                found_person.role = req.body.role;
                found_person.organisation = org;
                found_person.save();
              }
              res.json({
                status: 'success',
                data: found_person,
              });
            }
          );
        }
      });
    } else {
      res.json({
        status: 'fail',
        message: 'person not found.',
      });
    }
  });
}

//delete

export function DelPerson(req: any, res: any) {
  responsible_person.deleteOne(
    {
      _id: req.params._id,
    },
    (err: any, person: any) => {
      if (err) {
        res.json(err);
      } else {
        res.json({
          status:
            person.deletedCount + ' responsible person successfully deleted.',
          message: person,
        });
      }
    }
  );
}
