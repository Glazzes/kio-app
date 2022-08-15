import {TableContent} from 'react-native-pdf';
import {Indexes} from '../../../store/pdfStore';

export function convertTableContentsIntoIndexes(
  contents: TableContent[],
  numberOfPages: number,
): Indexes {
  const indexes: Indexes = {};
  let lastKey = 0;

  for (let index = 0; index < contents.length; index++) {
    let nextIndex = 0;
    let prevIndex = 0;

    if (index === 0) {
      prevIndex = 1;
      nextIndex =
        contents.length === 1 ? numberOfPages : contents[index + 1].pageIdx;
    }

    if (index !== 0) {
      nextIndex =
        index < contents.length - 1
          ? contents[index + 1].pageIdx
          : numberOfPages;
      prevIndex = lastKey;
    }

    const subIndexes = [];
    for (
      let subIndex = 0;
      subIndex < contents[index].children.length;
      subIndex++
    ) {
      const prevSubIndex =
        subIndex === 0
          ? contents[index].pageIdx
          : contents[index].children[subIndex - 1].pageIdx;

      let nextSubIndex = 0;
      if (subIndex === 0) {
        nextSubIndex = contents[index].pageIdx;
      }

      if (subIndex < contents[index].children.length - 1) {
        nextSubIndex = contents[index].children[subIndex + 1].pageIdx;
      } else {
        nextSubIndex =
          index + 1 === contents.length
            ? numberOfPages
            : contents[index + 1].pageIdx;
      }

      subIndexes.push({
        pageIdx: contents[index].children[subIndex].pageIdx,
        prev: prevSubIndex,
        next: nextSubIndex,
      });
    }

    indexes[contents[index].pageIdx] = {
      prev: prevIndex,
      next: nextIndex,
      subIndexes,
    };
    lastKey = contents[index].pageIdx;
  }

  return indexes;
}
