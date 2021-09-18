export const formatTime = (time: number): string => {
  const mins = Math.floor(time / 60) || 0;
  const secs = Math.round(time - mins * 60 || 0);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};
