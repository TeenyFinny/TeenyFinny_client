"use client"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/ui/modal/DeleteConfirmDialog"
export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <DeleteConfirmDialog
        trigger={<Button variant="outline">알림 열기</Button>}
        // onCancel={() => console.log("확인 clicked")}
        title = "정말 삭제하시겠어요?"
        description = "삭제하면 되돌릴 수 없어요"
        cancelText = "취소"
        deleteText = "삭제"
      />
    </main>
  )
}