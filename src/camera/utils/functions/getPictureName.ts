export function getPictureName(): string {
  const now = new Date();
  const year = now.getFullYear();
  const day = now.getDate();
  const month = now.getMonth();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const milliseconds = now.getMilliseconds();

  const date = `${year}${day}${month}`;
  const time = `${hours}${minutes}${milliseconds}`;

  return `IMG_${date}_${time}.jpg`;
}
