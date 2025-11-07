'use client'
import {Button} from '@/components/ui/button'

const testcard = () => {
    return (
        <div>
          <div className="text-red-600 font-bold">
            Tailwind Test
          </div>
          <div>
            Shadcn Test
            <Button onClick={() => alert("버튼이 클릭되었습니다!")}>
              button!
            </Button>
          </div>
        </div>
    );
}

export default testcard;