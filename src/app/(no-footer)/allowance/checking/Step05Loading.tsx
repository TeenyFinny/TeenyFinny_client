"use client"

interface Step05Loading {
  onNext: () => void
}

export default function Step05Loading({ onNext }: Step05Loading) {
  return (
    <div>
        loading...
        <button 
        className="w-[100px] f-[30px] text-neutral-3 bg-primary-1"
        onClick={onNext}>다음</button>
    </div>
  )
}
