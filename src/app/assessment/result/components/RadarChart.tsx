import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import type { Dimension } from '@/generated/prisma/client'

// 注册Chart.js组件
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface RadarChartProps {
  scores: number[]
  averageScores: number[]
  dimensions: Dimension[]
}

export function RadarChart({
  scores,
  averageScores,
  dimensions,
}: RadarChartProps) {
  const data = {
    labels: dimensions.map((d) => d.name),
    datasets: [
      {
        label: '您的得分',
        data: scores,
        backgroundColor: 'rgba(204, 79, 61, 0.3)', // primary color with higher opacity
        borderColor: '#CC4F3D', // primary color
        borderWidth: 3,
        pointBackgroundColor: '#CC4F3D', // primary color
        pointBorderColor: '#B79F67', // gold color
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#B79F67', // gold color
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: '平均分',
        data: averageScores,
        backgroundColor: 'rgba(183, 159, 103, 0.2)', // gold color with lower opacity
        borderColor: '#B79F67', // gold color
        borderWidth: 2,
        borderDash: [5, 5], // 虚线样式
        pointBackgroundColor: '#B79F67', // gold color
        pointBorderColor: '#FFFFFF', // white border
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#B79F67', // gold color
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  }

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(255, 255, 255, 0.2)', // white with opacity
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // white with opacity
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          color: '#D1D3D4', // gray-3 color
          backdropColor: 'transparent',
          font: {
            size: 12,
          },
        },
        pointLabels: {
          color: '#FFFFFF', // white color
          font: {
            size: 14,
            weight: 700,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#FFFFFF', // white color
          font: {
            size: 14,
            weight: 500,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(34, 34, 34, 0.9)', // gray-1 with opacity
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#B79F67', // gold color
        borderWidth: 1,
        padding: 12,
      },
    },
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Radar data={data} options={options} />
    </div>
  )
}
