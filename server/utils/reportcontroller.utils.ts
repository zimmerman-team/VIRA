export function getReportsFormattedData(err: any, data: any) {
  if (err) {
    return { status: 'error', message: err.message };
  }
  return {
    status: 'success',
    data: data.map((report: any) => ({
      ...report._doc,
      unix_date: new Date(report._doc.date).getTime() / 1000,
    })),
  };
}
