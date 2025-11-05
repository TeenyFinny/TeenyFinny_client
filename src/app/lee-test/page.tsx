import BarTest from "@/components/test/ui/bar/BarTest";
import ButtonTest from "@/components/test/ui/button/ButtonTest";
import CardForTest from "@/components/test/ui/card/CardForTest";
import InputTest from "@/components/test/ui/input/InputTest";
import { NavigationBar } from "@/components/ui/bar/navigation-bar";

export default function DesignSystemDemo() {
  return (
    // 화면 전체
    
         // <BarTest/>
         <NavigationBar
        userType="child"
      />
  );
}
