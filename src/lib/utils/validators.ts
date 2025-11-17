/**
 * 입력된 문자열 숫자를 지정된 범위로 보정하는 함수
 *
 * 기능:
 * - 빈 문자열("")은 그대로 허용하여 반환
 * - 숫자가 아닌 문자열은 빈 문자열("")로 처리
 * - 숫자가 min보다 작으면 min으로 보정
 * - 숫자가 max보다 크면 max로 보정
 *
 * @param {string} value - 입력값(문자열 형태의 숫자)
 * @param {number} min - 허용하는 최소값
 * @param {number} max - 허용하는 최대값
 * @returns {string} 보정된 숫자 문자열 또는 빈 문자열
 */
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


/**
 * 비밀번호 유효성 검사 함수
 *
 * 조건:
 * - 8자리 이상
 * - 특수문자 1개 이상 포함
 *
 * @param {string} password - 검사할 비밀번호 문자열
 * @returns {boolean} 유효한 비밀번호면 true, 아니면 false
 */
export const isValidPassword = (password: string): boolean => {
  if (!password) return false;

  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return hasMinLength && hasSpecialChar;
};
/**
 * YYYYMMDD 형식의 생년월일 유효성 검사
 *
 * @param {string} yyyymmdd - 검사할 날짜 (예: "20080517")
 * @returns {boolean} 유효한 날짜면 true, 아니면 false
 */
export const isValidBirthDate = (yyyymmdd: string): boolean => {
  if (!/^\d{8}$/.test(yyyymmdd)) return false;

  const year = Number(yyyymmdd.slice(0, 4));
  const month = Number(yyyymmdd.slice(4, 6));
  const day = Number(yyyymmdd.slice(6, 8));

  // 월 범위 체크
  if (month < 1 || month > 12) return false;

  // JS Date로 실제 존재하는 날짜인지 검증
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};
