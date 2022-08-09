const HOUR = 3600;
const MINUTE = 60;

export function convertCurrentTimeToTextTime(currentTime: number): string {
  'worklet';
  if (currentTime < MINUTE) {
    return `00:${currentTime >= 10 ? currentTime : '0' + currentTime}`;
  }

  let textTime = '';

  if (currentTime >= HOUR) {
    const hours = Math.floor(currentTime / HOUR);
    currentTime = currentTime % HOUR;
    textTime += `${hours}:`;
  }

  if (currentTime >= MINUTE) {
    const minutes = Math.floor(currentTime / 60);
    currentTime = currentTime % MINUTE;
    textTime += `${minutes > 9 ? minutes : '0' + minutes}:`;
  }

  textTime += `${currentTime > 9 ? currentTime : '0' + currentTime}`;

  return textTime;
}
