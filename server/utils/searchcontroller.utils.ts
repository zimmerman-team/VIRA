export function getSearchResults(data: any, res: any, err: any) {
  let reports = data.reports;
  if (!err) {
    reports = data.reportResults;
  }
  return res(
    JSON.stringify({
      data: {
        projects: data.projects,
        reports: reports,
        organisations: data.orgs,
      },
    })
  );
}
