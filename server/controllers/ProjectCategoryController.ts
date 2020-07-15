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
