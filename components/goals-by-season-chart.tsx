"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface SeasonData {
  season: string | number
  goals: number
  games: number
}

interface GoalsBySeasonChartProps {
  seasonData: SeasonData[]
}

export default function GoalsBySeasonChart({ seasonData }: GoalsBySeasonChartProps) {
  const chartRef = useRef<ChartJS>(null)

  // Sort data by seasons
  const sortedData = [...seasonData].sort((a, b) => {
    if (typeof a.season === "string" && typeof b.season === "string") {
      return a.season.localeCompare(b.season)
    }
    return Number(a.season) - Number(b.season)
  })

  const labels = sortedData.map((season) => season.season)
  const goalsData = sortedData.map((season) => season.goals)
  const gamesData = sortedData.map((season) => season.games)

  // Calculate efficiency (goals per game)
  const efficiencyData = sortedData.map((season) => Number.parseFloat((season.goals / season.games).toFixed(2)))

  // Create custom gradient for bars
  const getGradient = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, "rgba(231, 76, 60, 0.8)")
    gradient.addColorStop(1, "rgba(192, 57, 43, 0.2)")
    return gradient
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: "Goals",
        data: goalsData,
        backgroundColor: (context: any) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) {
            return "rgba(231, 76, 60, 0.8)"
          }
          return getGradient(ctx)
        },
        borderColor: "rgba(231, 76, 60, 1)",
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: "Games Played",
        data: gamesData,
        backgroundColor: "rgba(52, 152, 219, 0.5)",
        borderColor: "rgba(52, 152, 219, 1)",
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
        hidden: true, // Hidden by default
      },
      {
        label: "Goals per Game",
        data: efficiencyData,
        backgroundColor: "rgba(46, 204, 113, 0.5)",
        borderColor: "rgba(46, 204, 113, 1)",
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
        hidden: true, // Hidden by default
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#f9fafb",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(45, 36, 51, 0.9)",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        borderColor: "#4b5563",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === "Goals per Game") {
                label += context.parsed.y.toFixed(2)
              } else {
                label += context.parsed.y
              }
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(75, 85, 99, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
        },
      },
      y: {
        grid: {
          color: "rgba(75, 85, 99, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
        },
        beginAtZero: true,
      },
    },
    animation: {
      duration: 2000,
    },
  }

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && chartRef.current) {
            chartRef.current.update()
          }
        })
      },
      { threshold: 0.1 },
    )

    if (chartRef.current?.canvas) {
      observer.observe(chartRef.current.canvas)
    }

    return () => {
      if (chartRef.current?.canvas) {
        observer.unobserve(chartRef.current.canvas)
      }
    }
  }, [])

  return (
    <motion.div
      className="w-full bg-[#3a2f42] p-6 rounded-lg border border-white/5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="h-[400px]">
        <Bar data={chartData} options={options} ref={chartRef} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          className="bg-[#2d2433] rounded-lg p-4 border border-white/5"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-gray-400">Best Season</div>
          <div className="text-xl font-bold">2007-08</div>
          <div className="text-2xl font-bold text-[#e74c3c]">65 goals</div>
        </motion.div>

        <motion.div
          className="bg-[#2d2433] rounded-lg p-4 border border-white/5"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-gray-400">Average Per Season</div>
          <div className="text-xl font-bold">
            {(goalsData.reduce((a, b) => a + b, 0) / goalsData.length).toFixed(1)}
          </div>
          <div className="text-gray-300">goals per season</div>
        </motion.div>

        <motion.div
          className="bg-[#2d2433] rounded-lg p-4 border border-white/5"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-gray-400">50+ Goal Seasons</div>
          <div className="text-xl font-bold">{goalsData.filter((goals) => goals >= 50).length}</div>
          <div className="text-gray-300">seasons</div>
        </motion.div>
      </div>
    </motion.div>
  )
}
