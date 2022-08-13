import {TableContent} from 'react-native-pdf';
import {Indexes} from '../../../store/pdfStore';

export function convertTableContentsIntoIndexes(
  contents: TableContent[],
  numberOfPages: number,
): Indexes {
  const indexes: Indexes = {};
  let lastKey = 0;

  for (let i = 0; i < contents.length; i++) {
    if (i === 0) {
      const currentSectionIndex = contents[i].pageIdx;
      const next = contents.length === 1 ? 1 : contents[i + 1].pageIdx;

      indexes[currentSectionIndex] = {prev: 1, next};
      lastKey = currentSectionIndex;
      continue;
    }

    const next =
      i === contents.length - 1 ? numberOfPages : contents[i + 1].pageIdx;
    indexes[contents[i].pageIdx] = {prev: lastKey, next};
    lastKey = contents[i].pageIdx;
  }

  return indexes;
}
