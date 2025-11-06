// app/saving/page.tsx
export default function Page() {
  return (
    <h2>
        <div className="text-head-01 mb-12">
          알림함 페이지입니다.
        </div>
        <div className="text-body-03 mb-2">
          회원가입 이전에도 알림 버튼이 있기 때문에<br/>
          로그인되어있지 않은 사람은 적절한 안내 후 router.back() 필요
        </div>
    </h2>
  )
}