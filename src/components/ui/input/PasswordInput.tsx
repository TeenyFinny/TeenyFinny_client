"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function PasswordInput({
  value,
  onChange,
  placeholder = "",
  label = "Password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="w-[320px] h-[64px] rounded-[6px] bg-neutral-7 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.04)] 
        px-[16px] py-[11px] flex flex-col justify-between">
      {/* label */}
      <label className="text-body-08 leading-[14px] tracking-[-0.6px] text-neutral-3">
        {label}
      </label>

      {/* input + icon row */}
      <div className="flex items-center justify-between">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-neutral-1 text-body-01
            leading-[19px] tracking-[-0.6px] placeholder:text-neutral-3"
          aria-label={label}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="ml-[8px] flex items-center justify-center h-6 w-6 text-neutral-2 focus:outline-none"
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
        >
          {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
        </button>
      </div>
    </div>
  )
}
