export const clampNumberInRange = (value: string, min: number, max: number): string => {
  // 빈 문자열 허용
  if (value === "") return "";

  // 숫자가 아닌 값은 무시
  if (!/^\d+$/.test(value)) return "";

  let num = Number(value);

  if (num < min) num = min;
  if (num > max) num = max;

  return String(num);
};