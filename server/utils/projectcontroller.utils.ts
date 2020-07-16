const Project = require('../models/project');

export function getSingleProjectFormattedData(project: any, org: string) {
  return new Promise((resolve, reject) => {
    Project.populate(
      //first populate for organisation.
      project,
      {
        path: 'organisation',
        select: 'organisation_name ', //org name
        match: org
          ? {
              organisation_name: {
                $in: org.split(','),
              },
            }
          : {},
      },
      (err1: any, projects: any) => {
        //callback from first populate()
        Project.populate(
          // second populate for category
          projects,
          {
            path: 'category',
            select: 'name',
          },
          (err2: any, projects2: any) => {
            Project.populate(
              // third populate for category
              projects2,
              {
                path: 'person',
                select: 'email',
              },
              (err3: any, data: any) => {
                //callback from third populate()
                resolve({
                  data: data.filter((_project: any) => {
                    return _project.organisation != null;
                  }),
                });
              }
            );
          }
        );
      }
    );
  });
}

export function getProjectsFormattedData(data: any, org: string) {
  return new Promise((resolve, reject) => {
    Project.populate(
      data,
      {
        path: 'organisation',
        select: 'organisation_name', //org name and category name
        match: org
          ? {
              organisation_name: {
                $in: org.split(','),
              },
            }
          : {},
      },
      (err: any, projects: any) => {
        resolve({
          data: projects.filter((project: any) => {
            return project.organisation != null;
          }),
        });
      }
    );
  });
}
