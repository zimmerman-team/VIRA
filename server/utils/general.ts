import findIndex from 'lodash/findIndex';

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

export function mergeArrays(arrays: any[]) {
  const result: any[] = [];
  arrays.forEach((array: any) => {
    array.children.forEach((item: any) => {
      const fIndex = findIndex(result, { name: item.name });
      if (fIndex === -1) {
        result.push(item);
      } else {
        if (result[fIndex].value) {
          result[fIndex].value += item.value;
        }
        if (result[fIndex].budget) {
          result[fIndex].budget += item.budget;
        }
        if (result[fIndex].contribution) {
          result[fIndex].contribution += item.contribution;
        }
        if (result[fIndex].reached) {
          result[fIndex].reached += item.reached;
        }
        if (result[fIndex].target) {
          result[fIndex].target += item.target;
        }
      }
    });
  });
  return result;
}
