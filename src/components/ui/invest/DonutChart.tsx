// "use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell } from "recharts"
import requests from "@/lib/axios/requests"
import api from "@/lib/axios/axios";

interface PortfolioData {
  name: string
  percentage: number
  [key: string]: string | number  // ✅ Recharts 타입 호환
}

interface PortfolioDonutChartProps {
//   apiUrl?: string
  size?: number
  innerRadius?: number
  outerRadius?: number
}

const COLORS = ["#4169E1", "#7B9FF5", "#B4CAF7", "#DCE5FA"]
const RADIAN = Math.PI / 180

export function DonutChart({
  size = 176,
  innerRadius = 20,
  outerRadius = 75,
}: PortfolioDonutChartProps) {
  const [data, setData] = useState<PortfolioData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from:", requests.portfolio)
        setLoading(true)
        const res = await api.get(requests.portfolio)
        setData(res.data)
      } catch {
        setError("데이터를 불러올 수 없습니다")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [requests.portfolio])

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-body-05 text-neutral-2">로딩 중...</span>
      </div>
    )
  }

  // 조각 중앙에 정확히 라벨 그리기
  const renderCenterLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props
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
      {error && (
        <div className="absolute top-2 left-0 right-0 text-center">
          <span className="text-body-08 text-[#ef4c4a]">{error}</span>
        </div>
      )}

      {/* width/height를 고정값으로 주면 좌표 계산이 딱 맞아요 */}
      <PieChart width={size} height={size}>
        <Pie
          data={data}
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
        >
        {Array.isArray(data) &&
          data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
          ))}
        </Pie>
      </PieChart>
    </div>
  )
}
