import axios from 'axios';

export function uploadFiles(
  files: any[],
  callback: Function,
  onError: Function
) {
  const data = new FormData();
  for (let x = 0; x < files.length; x++) {
    data.append('file', files[x]);
  }
  axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, data)
    .then(res => {
      callback(res.data);
    })
    .catch(err => {
      onError(err);
    });
}
