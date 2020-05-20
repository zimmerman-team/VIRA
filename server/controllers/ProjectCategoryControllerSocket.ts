const projectCategory = require('../models/project_categroy');

export function allProjectCategory(req: any, res: any) {
  projectCategory.get((err: any, project_categroy: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }

    res(JSON.stringify(project_categroy));
  });
}

// get one project_category

export function oneProjectCategory(req: any, res: any) {
  projectCategory.findById(req.query.id, (err: any, project_categroy: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }
    res(JSON.stringify(project_categroy));
  });
}

// add one project_category

export function addProjectCategory(req: any, res: any) {
  let project_categroy = new projectCategory();

  project_categroy.name = req.query.name;
  project_categroy.description = req.query.description;
  project_categroy.save((err: any, project_categroy: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }

    res(
      JSON.stringify({
        message: 'new project category created',
        data: project_categroy,
      })
    );
  });
}

//update

export function UpdateProjectCategory(req: any, res: any) {
  projectCategory.findById(
    req.query.id,
    (err: any, found_projectCategory: any) => {
      if (err) {
        res.json(err);
      } else if (found_projectCategory) {
        found_projectCategory.name = req.query.name;
        found_projectCategory.description = req.query.description;
        found_projectCategory.save((err: any) => {
          if (err) {
            res(JSON.stringify({ status: 'error', message: err.message }));
          }
          res(
            JSON.stringify({ status: 'success', data: found_projectCategory })
          );
        });
      } else {
        res(
          JSON.stringify({
            status: 'fail',
            message: 'project categroy not found.',
          })
        );
      }
    }
  );
}

//delete

export function DelProjectCategory(req: any, res: any) {
  projectCategory.deleteOne(
    {
      _id: req.query.id,
    },
    (err: any, project_category: any) => {
      if (err) {
        res(JSON.stringify({ status: 'error', message: err.message }));
      } else {
        res(
          JSON.stringify({
            status:
              project_category.deletedCount +
              'project category successfully deleted.',
            message: project_category,
          })
        );
      }
    }
  );
}
