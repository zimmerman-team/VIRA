const Project = require('../models/project');

export function getSingleProjectFormattedData(project: any, org: string) {
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
    (err: any, projects: any) => {
      //callback from first populate()
      Project.populate(
        // second populate for category
        projects,
        {
          path: 'category',
          select: 'name',
        },
        (err: any, projects2: any) => {
          Project.populate(
            // third populate for category
            projects2,
            {
              path: 'person',
              select: 'email',
            },
            (err: any, data: any) => {
              //callback from third populate()
              return {
                data: data.filter((projects: any) => {
                  return projects.organisation != null;
                }),
              };
            }
          );
        }
      );
    }
  );
}

export function getProjectsFormattedData(data: any, org: string) {
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
    (err: any, data: any) => {
      return {
        data: data.filter((projects: any) => {
          return projects.organisation != null;
        }),
      };
    }
  );
}
