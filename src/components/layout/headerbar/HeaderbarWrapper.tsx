'use client'

import { useRouter } from "next/navigation"
import { HeaderBar } from "./HeaderBar"

const HeaderbarWrapper = () => {
    const router = useRouter()
    
      const handleBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back()
        else router.push("/")
      }
    
      const handleNotification = () => {
        router.push("/notice");
      }

    return (
        <div>
            <HeaderBar onBackClick={handleBack} onNotificationClick={handleNotification} />
        </div>
    );
}

export default HeaderbarWrapper;