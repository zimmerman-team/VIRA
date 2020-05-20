export function validateChallengesPlans(
  str1: string,
  str2: string,
  str3: string,
  str4: string
) {
  if (str1 === '') {
    return false;
  }
  if (str2 === '') {
    return false;
  }
  if (str3 === '') {
    return false;
  }
  if (str4 === '') {
    return false;
  }
  return true;
}
