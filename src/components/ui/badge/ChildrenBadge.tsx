"use client"

/**
 * ChildSelector 컴포넌트
 *
 * 자녀 프로필을 선택할 수 있는 버튼 컴포넌트입니다.
 * 성별에 따라 다른 아바타 이미지를 표시하고, 클릭 시 현재 선택된 자녀를 업데이트합니다.
 *
 * @example
 * \`\`\`tsx
 * <ChildSelector
 *   name="김티니"
 *   gender={1}
 *   childId="child-1"
 *   currentChild="child-1"
 *   setCurrentChild={setCurrentChild}
 * />
 * \`\`\`
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
  /** 현재 선택된 자녀를 설정하는 함수 */
  setCurrentChild: (childId: number) => void
}

export function ChildrenBadge({ name, gender, childId, currentChild, setCurrentChild }: ChildSelectorProps) {
  // TODO : Gender에 따라 다른 이미지 적용안됨
  const avatarImage = Number(gender) === 1 ? "/images/profile/icon_profile_2.png" : "/images/profile/icon_profile_1.png"

  const isSelected = currentChild === childId
  const opacityClass = isSelected ? "opacity-100" : "opacity-30"

  const handleClick = () => {
    setCurrentChild(childId)
  }

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center transition-opacity hover:opacity-80 active:opacity-60 ${opacityClass}`}
      type="button"
    >
      {/* 아바타 이미지 */}
      <div className="w-[64px] h-[64px] rounded-full bg-[#fafcff] flex items-center justify-center overflow-hidden">
        {avatarImage ? (
          <img src={avatarImage || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        ) : (
          // 이미지가 없을 때 플레이스홀더
          <div className="w-full h-full flex items-center justify-center bg-[#f6f7f8]">
            <div className="text-[#cacaca] text-4xl">👤</div>
          </div>
        )}
      </div>

      {/* 자녀 이름 */}
      <p className="text-head-03 text-[#343434]">{name}</p>
    </button>
  )
}
