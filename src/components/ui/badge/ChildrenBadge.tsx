"use client"

import Image from "next/image"

/**
 * ChildrenBadge
 *
 * 자녀의 프로필 아바타와 이름을 표시하는 배지 컴포넌트입니다.
 * 선택 가능한 형태로 동작하며, 선택 시 `setCurrentChild`를 통해 현재 자녀 ID를 업데이트합니다.
 * 성별에 따라 다른 기본 프로필 이미지를 표시합니다.
 *
 * @param {string} name - 자녀 이름
 * @param {number} gender - 성별 (1: 남, 2: 여)
 * @param {number} childId - 해당 배지의 자녀 ID
 * @param {number} currentChild - 현재 선택된 자녀 ID
 * @param {boolean} disabled - 비활성화 여부
 * @param {(childId: number) => void} setCurrentChild - 선택 상태를 갱신하는 콜백
 */
interface ChildSelectorProps {
  /** 자녀 이름 */
  name: string
  /** 성별 (1: 남자 이미지, 2: 여자 이미지) */
  gender: number
  /** 자녀 ID */
  childId: number
  /** 현재 선택된 자녀 ID */
  currentChild: number
  /** 비활성화 상태 --> 읽기 전용 */
  disabled?: boolean
  /** 현재 선택된 자녀를 설정하는 함수 */
  setCurrentChild: (childId: number) => void
}

export function ChildrenBadge({ name, gender, childId, currentChild, setCurrentChild, disabled }: ChildSelectorProps) {
  const avatarImage = Number(gender) === 1 ? "/images/profile/image_profile_boy.webp" : "/images/profile/image_profile_girl.jpg"

  const isSelected = currentChild === childId
  const opacityClass = disabled || isSelected ? "opacity-100" : "opacity-30"

  const handleClick = () => {
    setCurrentChild(childId)
  }

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center ${opacityClass} ${disabled ? "" : "cursor-pointer transition-opacity hover:opacity-80 active:opacity-60"}`}
      type="button"
      disabled={disabled}
    >
      {/* 아바타 이미지 */}
      <div className="w-[64px] h-[64px] rounded-full bg-primary-4 flex items-center justify-center overflow-hidden">
        {avatarImage ? (
          <Image src={avatarImage} alt={name} width={64} height={64} className="w-full h-full object-cover" />
        ) : (
          // 이미지가 없을 때 플레이스홀더
          <div className="w-full h-full flex items-center justify-center bg-neutral-6">
            <div className="text-neutral-4 text-4xl">👤</div>
          </div>
        )}
      </div>

      {/* 자녀 이름 */}
      <p className="text-head-03 text-neutral-1">{name}</p>
    </button>
  )
}
