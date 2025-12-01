import { PieChart, Pie, Cell } from "recharts"

interface PortfolioData {
  name: string
  percentage: number
  [key: string]: string | number  // Recharts 타입 호환
}

interface PortfolioDonutChartProps {
  data: { name: string; percentage: number }[];
  size?: number
  innerRadius?: number
  outerRadius?: number
}

const COLORS = ["#4169E1", "#7B9FF5", "#B4CAF7", "#DCE5FA"]
const RADIAN = Math.PI / 180

export function DonutChart({
  data,
  size = 176,
  innerRadius = 20,
  outerRadius = 75,
}: PortfolioDonutChartProps) {
  const isEmpty = !data || data.length === 0;
  const chartData = isEmpty ? [{ name: "empty", percentage: 1 }] : data;
  const chartColors = isEmpty ? ["#E0E0E0"] : COLORS; // neutral-4 color for empty state
    
  // 조각 중앙에 정확히 라벨 그리기
  const renderCenterLabel = (props: { cx: number; cy: number; midAngle?: number; innerRadius: number; outerRadius: number; percent?: number; name?: string }) => {
    if (isEmpty) return null; // 빈 데이터일 때는 라벨 표시 안 함
    
    const { cx, cy, midAngle = 0, innerRadius, outerRadius, percent = 0, name = "" } = props
    const r = innerRadius + (outerRadius - innerRadius) * 0.5 // 도넛 링 가운데
    // Recharts는 시계방향 각도, SVG 좌표계 보정 위해 -midAngle 사용
    const x = cx + r * Math.cos(-midAngle * RADIAN)
    const y = cy + r * Math.sin(-midAngle * RADIAN)

    return (
      <g transform={`translate(${x}, ${y})`} textAnchor="middle" dominantBaseline="middle" pointerEvents="none">
        <text className="text-body-07 text-neutral-1">
          {Math.round((percent ?? 0) * 100)}%
        </text>
        <text className="text-body-08 text-neutral-1" y={18}>
          {name}
        </text>
      </g>
    )
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>


      {/* width/height를 고정값으로 주면 좌표 계산이 딱 맞아요 */}
      <PieChart width={size} height={size}>
        <Pie
          data={chartData}
          dataKey="percentage"
          nameKey="name"
          cx={size / 2}
          cy={size / 2}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={90}
          endAngle={-270}         // 시계방향
          paddingAngle={0}
          labelLine={false}
          label={renderCenterLabel} // 여기서 라벨 중앙 배치
          isAnimationActive={false} // 필요시 true
          activeShape={false}
        >
        {Array.isArray(chartData) &&
          chartData.map((_, i) => (
            <Cell key={i} fill={chartColors[i % chartColors.length]} stroke="none" style={{ outline: 'none', cursor: 'default' }}/>
          ))}
        </Pie>
      </PieChart>
    </div>
  )
}
