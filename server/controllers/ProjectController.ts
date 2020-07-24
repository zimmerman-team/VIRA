const Project = require('../models/project');

export function allProject(req: any, res: any) {
  const { project_number, startDate, endDate } = req.query;

  let query;

  if (startDate && endDate) {
    query = { date_new: { $gte: startDate, $lt: endDate } };
  }

  if (project_number) {
    query = req.query.project_number.split(',');
  }

  if (!req.query.hasOwnProperty('project_number')) {
    console.log('We hit if');
    Project.get((err: any, project: any) => {
      if (err) {
        res.json({
          status: 'error',
          message: err.message,
        });
      }

      Project.populate(
        project,
        {
          path: 'organisation',
          select: 'organisation_name', //org name and category name
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
  } else {
    console.log('We hit else');
    Project.find({ query }, (err: any, projects: any) => {
      Project.populate(
        //first populate for organisation.
        projects,
        {
          path: 'organisation ',
          select: 'organisation_name ', //org name
          match: req.query.hasOwnProperty('organisation_name')
            ? {
                organisation_name: {
                  $in: req.query.organisation_name.split(','),
                },
              }
            : {},
        },
        (err: any, projects: any) => {
          //callback from first populate()
          Project.populate(
            // second populate for category
            projects,
            {
              path: 'category',
              select: 'name',
            },
            (err: any, data: any) => {
              //callback from second populate()
              res.json({
                data: data.filter((projects: any) => {
                  return projects.organisation != null;
                }),
              });
            }
          );
        }
      );
    });
  }
}

//get one project

export function oneProject(req: any, res: any) {
  Project.findById(req.params._id)
    .populate('category', 'name')
    .populate('organisation', 'organisation_name')
    .exec((err: any, project: any) => {
      if (err) {
        res.send(err);
      }
      res.json({
        data: project,
      });
    });
}
