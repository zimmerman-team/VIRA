export function genericError(error: any, res: any) {
  const _error = error.response.data || error;
  return res(JSON.stringify(_error));
}

export function authGenericError(res: any) {
  return res(JSON.stringify({ message: 'Something went wrong.' }));
}

export function makePass(length: number): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const isArray = function(a: any) {
  return !!a && a.constructor === Array;
};
