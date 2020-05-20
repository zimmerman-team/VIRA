const projectCategory = require('../models/project_categroy');

export function allProjectCategory(req: any, res: any) {
  projectCategory.get((err: any, project_categroy: any) => {
    if (err) {
      res.json({
        status: 'error',
        message: err.message,
      });
    }
    res.json({
      data: project_categroy,
    });
  });
}

// get one project_category

export function oneProjectCategory(req: any, res: any) {
  projectCategory.findById(
    req.params._id,
    (err: any, project_categroy: any) => {
      if (err) {
        res.send(err);
      }
      res.json({ data: project_categroy });
    }
  );
}

// add one project_category

export function addProjectCategory(req: any, res: any) {
  let project_categroy = new projectCategory();

  project_categroy.name = req.body.name;
  project_categroy.description = req.body.description;
  project_categroy.save((err: any, project_categroy: any) => {
    if (err) {
      res.send(err);
    }
    res.json({
      message: 'new project category created.',
      data: project_categroy,
    });
  });
}

//update

export function UpdateProjectCategory(req: any, res: any) {
  projectCategory.findById(
    req.params._id,
    (err: any, found_projectCategory: any) => {
      if (err) {
        res.json(err);
      } else if (found_projectCategory) {
        found_projectCategory.name = req.body.name;
        found_projectCategory.description = req.body.description;
        found_projectCategory.save((err: any) => {
          if (err) {
            res.json(err);
          }
          res.json({
            status: 'success',
            data: found_projectCategory,
          });
        });
      } else {
        res.json({
          status: 'fail',
          message: 'project categroy not found.',
        });
      }
    }
  );
}

//delete

export function DelProjectCategory(req: any, res: any) {
  projectCategory.deleteOne(
    {
      _id: req.params._id,
    },
    (err: any, project_categroy: any) => {
      if (err) {
        res.json(err);
      } else {
        res.json({
          status:
            project_categroy.deletedCount +
            ' project category successfully deleted.',
          message: project_categroy,
        });
      }
    }
  );
}
