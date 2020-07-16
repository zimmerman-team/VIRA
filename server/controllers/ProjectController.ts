const Project = require('../models/project');

export function allProject(req: any, res: any) {
  if (!req.query.hasOwnProperty('project_number')) {
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
        (err2: any, data: any) => {
          res.json({
            data: data.filter((projects: any) => {
              return projects.organisation != null;
            }),
          });
        }
      );
    });
  } else {
    Project.find(
      { project_number: req.query.project_number.split(',') },
      (err: any, projects: any) => {
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
          (err2: any, projects2: any) => {
            //callback from first populate()
            Project.populate(
              // second populate for category
              projects2,
              {
                path: 'category',
                select: 'name',
              },
              (err3: any, data: any) => {
                //callback from second populate()
                res.json({
                  data: data.filter((project: any) => {
                    return project.organisation != null;
                  }),
                });
              }
            );
          }
        );
      }
    );
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
