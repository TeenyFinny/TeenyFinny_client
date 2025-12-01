import { cn } from "@/lib/utils"

interface NotificationItemProps {
  message: string
  content?: string
  time: string
  isRead?: boolean
  className?: string
}

export function NotificationItem({
  message,
  content,
  time,
  isRead = false,
  className
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-2.5 px-6 h-[76px] border-b border-monochrome-gray",
        className
      )}
    >
      {/* Dot indicator */}
      <div
        className={cn(
          "w-3 h-3 rounded-full shrink-0",
          !isRead ? "bg-info" : "bg-neutral-3"
        )}
      />

      {/* Message text */}
      <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
        <div className="text-body-06 text-neutral-1 truncate">
          {message}
        </div>
        {content && (
          <div className="text-body-07 text-neutral-2 truncate">
            {content}
          </div>
        )}
      </div>

      {/* Time (위에서 14px 아래) */}
      <div className="absolute right-5 top-3.5 text-body-08 text-neutral-2 shrink-0">
        {time}
      </div>
    </div>
  )
}
