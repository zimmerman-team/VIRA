const Project = require('../models/project');
const project_categroy = require('../models/project_categroy');
const organisation = require('../models/Org');

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

//add a project

export function addProject(req: any, res: any) {
  project_categroy.findOne(
    { name: req.body.category },
    (err: any, category: any) => {
      if (category) {
        let project = new Project();
        project.project_number = req.body.project_number;
        project.project_name = req.body.project_name;
        project.project_description = req.body.project_description;
        project.duration = req.body.duration;
        project.start_date = req.body.start_date;
        project.end_date = req.body.end_date;
        project.total_amount = req.body.total_amount;
        project.decision_date = req.body.decision_date;
        project.decision = req.body.decision;
        project.allocated_amount = req.body.allocated_amount;
        project.released_amount = req.body.released_amount;
        project.paid_amount = req.body.paid_amount;
        project.category = category;
        //save project

        project.save((err: any, project: any) => {
          if (err) {
            res.json(err);
          }
          organisation.findOne(
            { organisation_name: req.body.organisation },
            (err: any, org: any) => {
              project.organisation = org;
              project.save((err: any, project: any) => {
                if (err) {
                  res.json(err);
                }
                res.json({
                  message: 'new project successfully created.',
                  data: project,
                });
              });
            }
          );
        });
      } else if (!category) {
        let project = new Project();
        project.project_number = req.body.project_number;
        project.project_name = req.body.project_name;
        project.project_description = req.body.project_description;
        project.duration = req.body.duration;
        project.start_date = req.body.start_date;
        project.end_date = req.body.end_date;
        project.total_amount = req.body.total_amount;
        project.decision_date = req.body.decision_date;
        project.decision = req.body.decision;
        project.allocated_amount = req.body.allocated_amount;
        project.released_amount = req.body.released_amount;
        project.paid_amount = req.body.paid_amount;

        //save project

        project.save((err: any, project: any) => {
          if (err) {
            res.json(err);
          }
          organisation.findOne(
            { organisation_name: req.body.organisation },
            (err: any, org: any) => {
              project.organisation = org;
              project.save((err: any, project: any) => {
                if (err) {
                  res.json(err);
                }
                res.json({
                  message: 'new project successfully created.',
                  data: project,
                });
              });
            }
          );
        });
      }
    }
  );
}

//update project

export function UpdateProject(req: any, res: any) {
  Project.findById(req.params._id, (err: any, found_project: any) => {
    if (err) {
      res.json(err);
    } else if (found_project) {
      found_project.project_number = req.body.project_number;
      found_project.project_name = req.body.project_name;
      found_project.project_description = req.body.project_description;
      found_project.duration = req.body.duration;
      found_project.start_date = req.body.start_date;
      found_project.end_date = req.body.end_date;
      found_project.total_amount = req.body.total_amount;
      found_project.decision_date = req.body.decision_date;
      found_project.decision = req.body.decision;
      found_project.allocated_amount = req.body.allocated_amount;
      found_project.released_amount = req.body.released_amount;
      found_project.paid_amount = req.body.paid_amount;
      found_project.organisation = req.body.organanisation;

      found_project.save((err: any) => {
        if (err) {
          res.json(err);
        }
        res.json({
          status: 'success',
          data: found_project,
        });
      });
    } else {
      res.json({
        status: 'fail',
        message: 'project not found.',
      });
    }
  });
}

//delete

export function DelProject(req: any, res: any) {
  Project.deleteOne(
    {
      _id: req.params._id,
    },
    (err: any, project: any) => {
      if (err) {
        res.json(err);
      } else {
        res.json({
          status: project.deletedCount + ' organisation successfully deleted.',
          message: project,
        });
      }
    }
  );
}
