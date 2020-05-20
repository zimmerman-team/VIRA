export function validateOutcomeFields(title: string, country: string) {
  if (title === '') {
    return false;
  }
  if (country === '') {
    return false;
  }
  return true;
}
