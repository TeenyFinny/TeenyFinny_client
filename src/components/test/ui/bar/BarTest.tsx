"use client"

import { useState } from "react"
import { NavigationBar } from "@/components/ui/bar/navigation-bar"

export default function TestPage() {
  const [userType, setUserType] = useState<"parent" | "child">("child")
  const [currentPage, setCurrentPage] = useState("/home")
  const [highlightColor, setHighlightColor] = useState("#343434")
  const [disabled, setDisabled] = useState(false)

  const handleNavigate = (page: string) => {
    console.log(`[v0] Test page - Navigating to: ${page}`)
    setCurrentPage(page)
  }

  const toggleUserType = () => {
    setUserType((prev) => (prev === "parent" ? "child" : "parent"))
    if (userType === "child" && (currentPage === "/quiz" || currentPage === "/investment")) {
      setCurrentPage("/home")
    }
  }

  const colors = [
    { name: "Primary Blue", value: "#0067ac" },
    { name: "Primary Cyan", value: "#20c4f4" },
    { name: "Success Green", value: "#55bb59" },
    { name: "Warning Orange", value: "#ffaf2a" },
    { name: "Error Red", value: "#ef4c4a" },
  ]

  return (
    <div className="min-h-screen bg-[#fafcff] pb-24">
      <div className="bg-[#0067ac] text-white p-4 text-center">
        <h1 className="text-2xl font-bold">네비게이션 바 테스트 페이지</h1>
        <p className="text-sm mt-1">아래로 스크롤하여 하단 네비게이션 바를 확인하세요</p>
      </div>

      <div className="max-w-screen-sm mx-auto p-6 space-y-6">
        {/* Current Status */}
        <div className="bg-[#ffffff] rounded-2xl p-6 space-y-4 border border-[#e8ebee]">
          <h2 className="text-head-04 text-[#343434]">현재 상태</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-body-07 text-[#898989]">사용자 타입:</span>
              <span className="text-body-05 text-[#343434]">
                {userType === "parent" ? "부모 (3개 아이콘)" : "자녀 (4개 아이콘)"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-07 text-[#898989]">현재 페이지:</span>
              <span className="text-body-05 text-[#343434]">{currentPage}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-07 text-[#898989]">강조 색상:</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border border-[#e8ebee]"
                  style={{ backgroundColor: highlightColor }}
                />
                <span className="text-body-05 text-[#343434]">{highlightColor}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-07 text-[#898989]">네비게이션 바:</span>
              <span className="text-body-05 text-[#343434]">{disabled ? "비활성화됨" : "활성화됨"}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#ffffff] rounded-2xl p-6 space-y-4 border border-[#e8ebee]">
          <h2 className="text-head-04 text-[#343434]">컨트롤</h2>

          {/* User Type Toggle */}
          <div className="space-y-2">
            <label className="text-body-05 text-[#343434]">사용자 타입 전환</label>
            <button
              onClick={toggleUserType}
              className="w-full py-3 px-4 bg-[#0067ac] text-[#ffffff] rounded-lg text-body-05 font-medium transition-opacity hover:opacity-90 active:opacity-80"
            >
              {userType === "parent" ? "자녀 모드로 전환" : "부모 모드로 전환"}
            </button>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-body-05 text-[#343434]">강조 색상 변경</label>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setHighlightColor("#343434")}
                  className={`py-2 px-3 rounded-lg text-body-07 font-medium transition-all border-2 ${
                    highlightColor === color.value
                      ? "border-[#343434] bg-[#f7f9a7]"
                      : "border-[#e8ebee] bg-[#ffffff] hover:border-[#cacaca]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-[#e8ebee]"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-[#343434]">{color.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Disable Toggle */}
          <div className="space-y-2">
            <label className="text-body-05 text-[#343434]">네비게이션 바 활성화</label>
            <button
              onClick={() => setDisabled(!disabled)}
              className={`w-full py-3 px-4 rounded-lg text-body-05 font-medium transition-opacity ${
                disabled
                  ? "bg-[#55bb59] text-[#ffffff] hover:opacity-90"
                  : "bg-[#ef4c4a] text-[#ffffff] hover:opacity-90"
              } active:opacity-80`}
            >
              {disabled ? "네비게이션 바 활성화" : "네비게이션 바 비활성화"}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[#e8ebee] rounded-2xl p-6 space-y-3">
          <h2 className="text-head-04 text-[#343434]">테스트 가이드</h2>
          <ul className="space-y-2 text-body-07 text-[#606e7b] list-disc list-inside">
            <li>하단 네비게이션 바의 아이콘을 클릭하여 페이지 전환을 테스트하세요</li>
            <li>사용자 타입을 전환하여 아이콘 개수 변화를 확인하세요</li>
            <li>강조 색상을 변경하여 활성 아이콘 색상을 테스트하세요</li>
            <li>네비게이션 바를 비활성화하여 숨김 기능을 확인하세요</li>
            <li>브라우저 콘솔(F12)에서 페이지 이동 로그를 확인하세요</li>
          </ul>
        </div>

        <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e8ebee]">
          <h2 className="text-head-04 text-[#343434] mb-4">스크롤 테스트 영역</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 bg-[#fafcff] rounded-lg">
                <p className="text-body-07 text-[#898989]">
                  테스트 콘텐츠 {i} - 페이지를 스크롤하여 하단 네비게이션 바가 항상 고정되어 있는지 확인하세요.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <NavigationBar
        userType={userType}
        onNavigate={handleNavigate}
        disabled={disabled}
      />
    </div>
  )
}
