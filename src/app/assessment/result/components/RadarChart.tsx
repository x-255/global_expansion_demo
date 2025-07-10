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
import { dimensions } from '../../assessmentModel'

// 注册Chart.js组件
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

// 图表配置
const chartOptions = {
  scales: {
    r: {
      angleLines: {
        display: true,
      },
      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
}

export const RadarChart = ({ scores }: { scores: number[] }) => {
  const chartData = {
    labels: dimensions.map((d) => d.name),
    datasets: [
      {
        label: '维度得分',
        data: scores,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 aspect-square">
      <Radar data={chartData} options={chartOptions} />
    </div>
  )
} 