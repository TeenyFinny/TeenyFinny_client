"use client"

/**
 * ToggleSwitchProps
 * @typedef {Object} ToggleSwitchProps
 * @property {boolean} isOn - 토글의 ON/OFF 상태를 제어합니다. `true`일 때 토글이 켜진 상태입니다.
 * @property {(isOn: boolean) => void} setIsOn - 토글의 상태를 변경하는 setter 함수입니다.
 */
interface ToggleSwitchProps {
  isOn: boolean
  setIsOn: (isOn: boolean) => void
}

/**
 * ToggleSwitch
 *
 * ON/OFF 상태를 시각적으로 표현하는 토글 스위치 컴포넌트입니다.
 *
 * ### 특징
 * - `isOn` 상태를 기반으로 토글의 위치와 색상이 변경됩니다.
 * - 클릭 시 `setIsOn` 함수를 호출하여 상위 컴포넌트의 상태를 조작합니다.
 * - 부드러운 애니메이션으로 토글이 자연스럽게 움직입니다.
 *
 * ### 시각적 구성
 * - OFF 상태: 회색 배경(`#e8ebee`)에 왼쪽에 위치한 흰색 원형 노브
 * - ON 상태: 파란색 배경(`#0067ac`)에 오른쪽에 위치한 흰색 원형 노브
 * - 토글 배경과 노브 모두 부드러운 전환 애니메이션 적용
 *
 * @component
 * @param {ToggleSwitchProps} props - ToggleSwitch 컴포넌트 속성
 * @returns {React.ReactElement} 토글 스위치 요소
 *
 * @example
 * ```tsx
 * const [isOn, setIsOn] = useState(false)
 *
 * <ToggleSwitch
 *   isOn={isOn}
 *   setIsOn={setIsOn}
 * />
 * ```
 */
export function Toggle({ isOn, setIsOn }: ToggleSwitchProps) {
  /**
   * 토글 클릭 시 상태를 반전시키는 이벤트 핸들러입니다.
   */
  const handleToggle = () => {
    setIsOn(!isOn)
  }

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex h-[32px] w-[50px] items-center p-[3px] rounded-[15.9091px] transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-1 focus:ring-offset-2 ${
        isOn ? "bg-primary-1" : "bg-neutral-6"
      }`}
      role="switch"
      aria-checked={isOn}
    >
      <span
        className={`inline-block h-[26px] w-[26px] transform rounded-full bg-neutral-7 [box-shadow:0px_2px_4px_rgba(0,0,0,0.24)] transition-transform duration-300 ease-in-out ${
          isOn ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  )
}
