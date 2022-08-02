export const durationToText = (duration: number): string => {
  'worklet';

  // console.log(duration);
  if (duration < 10) {
    return `00:0${duration}`;
  }

  if (duration < 60) {
    return `00:${duration}`;
  }

  let result = '';

  if (duration >= 3600) {
    const hours = Math.floor(duration / 3600);
    duration = duration % 3600;
    result += `${hours}:`;
  }

  if (duration >= 60) {
    const minutes = Math.floor(duration / 60);
    duration = duration % 60;
    result += `${minutes > 9 ? minutes : '0' + minutes}:`;
  }

  result += `${duration > 9 ? duration : '0' + duration}`;

  return result;
};
