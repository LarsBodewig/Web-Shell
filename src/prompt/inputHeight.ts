let prevHeight = 0;
const magicHeightConstant = -4;

export function calcInputHeight(scrollHeight: number): string {
  const newHeight = scrollHeight + magicHeightConstant;
  prevHeight = scrollHeight;
  return newHeight + "px";
}

export function isHeightMore(scrollHeight: number): boolean {
  return scrollHeight > prevHeight;
}
