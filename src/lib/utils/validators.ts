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
