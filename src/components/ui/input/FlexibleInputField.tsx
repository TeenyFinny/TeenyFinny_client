"use client";

import type React from "react";

/**
 * FlexibleInputFieldProps
 * @typedef {Object} FlexibleInputFieldProps
 * @property {string} label - 입력 필드 상단에 표시되는 레이블 텍스트.
 * @property {boolean} enabled - `true`면 입력 가능한 상태(Editable), `false`면 읽기 전용 표시(Static Box).
 * @property {string} [text] - 입력 가능한 상태에서 표시될 현재 값(Controlled value).
 * @property {(text: string) => void} [setText] - 입력 값 변경 콜백. `enabled`가 `true`일 때만 사용됩니다.
 * @property {string} [content] - 읽기 전용 상태에서 표시할 텍스트 콘텐츠.
 * @property {string} [placeholder] - 입력 가능한 상태에서의 placeholder 텍스트.
 * @property {React.HTMLInputTypeAttribute} [type] - 입력 필드의 type 속성.
 * @property {"sm" | "md" | "lg"} [inputSize] - 입력 필드 높이 사이즈. 기본값은 `lg`입니다.
 */
interface FlexibleInputFieldProps {
  readonly label: string;
  readonly enabled: boolean;
  readonly text?: string;
  readonly setText?: (text: string) => void;
  readonly content?: string;
  readonly placeholder?: string;
  readonly type?: React.HTMLInputTypeAttribute;
  readonly inputSize?: "sm" | "md" | "lg";
}

/**
 * FlexibleInputField
 *
 * 단일 컴포넌트로 **입력 가능 상태**와 **읽기 전용 상태**를 전환하여 사용할 수 있는 필드 컴포넌트입니다.
 *
 * - `enabled = true`일 때: `<input>`으로 렌더링되며, `text` & `setText`를 통한 **완전 제어(Controlled)** 패턴을 사용합니다.
 * - `enabled = false`일 때: 회색 배경의 정적 `<div>`로 렌더링되어 값을 표시만 합니다(편집 불가).
 *
 * @component
 * @param {FlexibleInputFieldProps} props - 컴포넌트 속성
 * @returns {React.ReactElement} 입력 가능/읽기 전용 필드
 *
 * @example
 * // 입력 가능한 상태(Controlled)
 * const [name, setName] = useState("");
 * <FlexibleInputField
 *   label="이름"
 *   enabled
 *   text={name}
 *   setText={setName}
 *   placeholder="이름을 입력하세요"
 * />
 *
 * @example
 * // 읽기 전용 상태
 * <FlexibleInputField
 *   label="이메일"
 *   enabled={false}
 *   content="user@example.com"
 * />
 *
 * @remarks
 * - `enabled=true`인 경우 `setText`가 제공되지 않으면 입력이 반영되지 않습니다.
 * - 접근성: 상단 `<label>`은 시각적 안내용이며, 별도의 `id/htmlFor` 연결은 포함하지 않았습니다.
 */
export function FlexibleInputField({
  label,
  enabled,
  text,
  setText,
  content,
  placeholder,
  type = "text",
  inputSize = "sm",
}: FlexibleInputFieldProps) {
  const sizeClass = (() => {
    switch (inputSize) {
      case "sm":
        return "h-[44px] text-body-07";
      case "lg":
      default:
        return "h-16 text-body-06";
    }
  })();

  const readOnlySizeClass = (() => {
    switch (inputSize) {
      case "sm":
        return "min-h-[44px]";
      case "lg":
      default:
        return "min-h-[64px]";
    }
  })();

  /**
   * 입력 값 변경 핸들러.
   * `enabled`가 `true`이고 `setText`가 전달된 경우에만 상위 상태를 갱신합니다.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - 입력 이벤트
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (enabled && setText) {
      setText(e.target.value);
    }
  };

  return (
    <div className="w-full space-y-1">
      {/* label */}
      <label className="block text-body-07 text-neutral-3 whitespace-pre-line">
        {label}
      </label>

      {/* input field */}
      {enabled ? (
        <input
          type={type}
          value={text || ""}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full ${sizeClass} px-3 py-2 bg-neutral-7 border border-neutral-6 rounded-[6px] 
          text-neutral-1 placeholder:text-neutral-3 focus:outline-none focus:ring-2 focus:ring-primary-1 
          focus:border-transparent transition-all whitespace-pre-line`}
        />
      ) : (
        <div
          className={`w-full ${readOnlySizeClass} px-3 py-2 bg-neutral-6 border border-neutral-5 rounded-[6px] text-body-06 
        text-neutral-2 whitespace-pre-line flex items-center`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
