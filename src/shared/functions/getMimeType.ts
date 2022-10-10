import {MimeType} from '../enum/MimeType';

export function getSimpleMimeType(mimeType: string): MimeType {
  if (mimeType.startsWith('image')) {
    return MimeType.IMAGE;
  }

  if (mimeType.startsWith('audio')) {
    return MimeType.AUDIO;
  }

  if (mimeType.startsWith('video')) {
    return MimeType.VIDEO;
  }

  if (mimeType === 'application/pdf') {
    return MimeType.PDF;
  }

  return MimeType.GENERIC;
}
