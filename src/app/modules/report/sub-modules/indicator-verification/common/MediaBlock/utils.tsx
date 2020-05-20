import React from 'react';
import find from 'lodash/find';
import { Picture } from 'app/assets/icons/Picture';
import { Video } from 'app/assets/icons/Video';
import { Document } from 'app/assets/icons/Document';

const pictureExts = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'svg',
  'bmp',
  'ico',
  'webp',
  'tiff',
  'tif',
];
const videoExts = ['avi', 'mpeg', 'ogv', 'webm', '3gp', '3g2', 'mov', 'mp4'];
const documentExts = [
  'doc',
  'docx',
  'xls',
  'csv',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'pdf',
];

export function getMediaIcon(name: string) {
  const extension = name.split('.')[1];
  if (find(pictureExts, (ext: string) => ext === extension)) {
    return <Picture />;
  }
  if (find(videoExts, (ext: string) => ext === extension)) {
    return <Video />;
  }
  if (find(documentExts, (ext: string) => ext === extension)) {
    return <Document />;
  }
  return <Document />;
}
