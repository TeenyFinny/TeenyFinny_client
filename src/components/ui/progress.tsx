"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  backgroundColor?: string;      // 프로그레스 바 배경색
  indicatorColor?: string;       // 차오르는 색
}

function Progress({
  className,
  value,
  backgroundColor = "bg-primary/20", // 기본 배경색
  indicatorColor = "bg-primary",     // 기본 차오르는 색
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        backgroundColor,
        "relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(indicatorColor, "h-full w-full flex-1 transition-all")}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
