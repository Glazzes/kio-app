const unitSizes = [1024 ** 3, 1024 ** 2, 1024, 1];
const unitNames = ['Gb', 'Mb', 'Kb', 'b'];

export function convertBytesToRedableUnit(bytes: number): string {
  if (bytes < 1) {
    return 'N/A';
  }

  let flag = true;
  let index = 0;

  let size = '';
  let name = unitNames[unitNames.length - 1];

  while (flag) {
    const convertedBytes = bytes / unitSizes[index];

    if (convertedBytes >= 1) {
      size = convertedBytes.toFixed(1);
      name = unitNames[index];
      flag = false;
    }

    index++;
  }

  const checkedSize = size.slice(-1) === '0' ? size.slice(0, -2) : size;
  return `${checkedSize} ${name}`;
}
