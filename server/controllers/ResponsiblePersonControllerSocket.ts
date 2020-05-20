const responsible_person = require('../models/responsiblePerson');
const organisation = require('../models/Org');

export function allPerson(req: any, res: any) {
  responsible_person.get((err: any, person: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }
    responsible_person.populate(
      person,
      {
        path: 'organisation',
        select: 'organisation_name ', //org name
        match: req.query.organisation_name
          ? {
              organisation_name: {
                $in: req.query.organisation_name.split(','),
              },
            }
          : {},
      },
      (err: any, data: any) => {
        res(
          JSON.stringify({
            data: data.filter((projects: any) => {
              return projects.organisation != null;
            }),
          })
        );
      }
    );
  });
}

//one person

export function onePeron(req: any, res: any) {
  responsible_person
    .findById(req.query.id)
    .populate({
      path: 'organisation',
      select: 'organisation_name',
    })
    .exec((err: any, org: any) => {
      if (err) {
        res(JSON.stringify({ status: 'error', message: err.message }));
      }
      res(JSON.stringify({ data: org }));
    });
}

//add responsible person

export function AddPerson(req: any, res: any) {
  organisation.findOne(
    { organisation_name: req.query.organisation },
    (err: any, org: any) => {
      if (!org) {
        let person = new responsible_person();
        person.family_name = req.query.family_name;
        person.initials = req.query.initials;
        person.name_insertion = req.query.name_insertion;
        person.title = req.query.title;
        person.email = req.query.email;
        person.login_email = req.query.login_email;
        person.sex = req.query.sex;
        person.role = req.query.role;
        //save person.
        person.save((err: any) => {
          if (err) {
            res(JSON.stringify({ status: 'error', message: err.message }));
          }
          res(
            JSON.stringify({
              message: 'a new responsible person successfully created.',
              data: person,
            })
          );
        });
      } else if (org) {
        let person = new responsible_person();
        person.family_name = req.query.family_name;
        person.initials = req.query.initials;
        person.name_insertion = req.query.name_insertion;
        person.title = req.query.title;
        person.email = req.query.email;
        person.login_email = req.query.login_email;
        person.sex = req.query.sex;
        person.role = req.query.role;
        person.organisation = org;
        //save person.
        person.save((err: any) => {
          if (err) {
            res(JSON.stringify({ status: 'error', message: err.message }));
          }
          res(
            JSON.stringify({
              message: 'a new responsible person successfully created.',
              data: person,
            })
          );
        });
      }
    }
  );
}

//update

export function UpdatePerson(req: any, res: any) {
  responsible_person.findById(req.query.id, (err: any, found_person: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    } else if (found_person) {
      found_person.family_name = req.query.family_name;
      found_person.initials = req.query.initials;
      found_person.name_insertion = req.query.name_insertion;
      found_person.title = req.query.title;
      found_person.email = req.query.email;
      found_person.login_email = req.query.login_email;
      found_person.sex = req.query.sex;
      found_person.role = req.query.role;

      found_person.save((err: any, found_person: any) => {
        if (err) {
          res(JSON.stringify({ status: 'error', message: err.message }));
        } else {
          organisation.findOne(
            { organisation_name: req.query.organisation },
            (err: any, org: any) => {
              if (org) {
                found_person.family_name = req.query.family_name;
                found_person.initials = req.query.initials;
                found_person.name_insertion = req.query.name_insertion;
                found_person.title = req.query.title;
                found_person.email = req.query.email;
                found_person.login_email = req.query.login_email;
                found_person.sex = req.query.sex;
                found_person.role = req.query.role;
                found_person.organisation = org;
                found_person.save();
              }
              res(JSON.stringify({ status: 'success', data: found_person }));
            }
          );
        }
      });
    } else {
      res(JSON.stringify({ status: 'fail', message: 'person not found.' }));
    }
  });
}

//delete

export function DelPerson(req: any, res: any) {
  responsible_person.deleteOne(
    {
      _id: req.query.id,
    },
    (err: any, person: any) => {
      if (err) {
        res.json(err);
      } else {
        res(
          JSON.stringify({
            status:
              person.deletedCount + ' responsible person successfully deleted.',
            message: person,
          })
        );
      }
    }
  );
}
