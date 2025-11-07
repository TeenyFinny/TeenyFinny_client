'use client'
import { Button } from '@/components/ui/button'

const CardForTest = () => {
    return (
        <div>
            <div className='font-black text-2xl mb-10'>
                이 페이지는 라이브러리 테스트 페이지입니다.
            </div>
            <div className="text-red-600 font-bold mb-9">
                Tailwind Test
            </div>
            <div>
                <div className='mb-1'>
                    Shadcn Test
                </div>
                <Button onClick={() => alert("버튼이 클릭되었습니다!")}>
                    button!
                </Button>
            </div>
        </div>
    );
}

export default CardForTest;