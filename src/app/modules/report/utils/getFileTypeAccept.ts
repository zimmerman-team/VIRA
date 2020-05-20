export function getFileTypeAccept(type: string): string {
  if (type === 'picture') {
    return 'image';
  }
  if (type === 'video') {
    return 'video';
  }
  if (type === 'document') {
    return 'application,text';
  }
  return '';
}
