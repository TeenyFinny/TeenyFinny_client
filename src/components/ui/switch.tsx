"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  return (
    <SwitchPrimitives.Root
      ref={ref}
      className={cn(
        "peer inline-flex cursor-pointer items-center rounded-full transition-colors",
        "w-[50px] h-[32px]",
        "bg-monochrome-gray data-[state=checked]:bg-primary-1",
        "border border-transparent",
        className
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-md transition-transform duration-200",
          "w-[28px] h-[28px]",
          // 처음 위치 2px, 켜졌을 때 오른쪽으로 이동 20px
          "translate-x-[2px] data-[state=checked]:translate-x-[20px]"
        )}
      />
    </SwitchPrimitives.Root>
  )
})

Switch.displayName = "Switch"

export { Switch }
