"use client"

import { motion } from "framer-motion"
import { Trophy, Award, Star, TrendingUp, Clock, Zap } from "lucide-react"

interface StatsProps {
  stats: {
    goals: number
    assists: number
    points: number
    gamesPlayed: number
  }
}

export default function StatsSection({ stats }: StatsProps) {
  // Проверяем, что stats существует и содержит необходимые данные
  if (!stats || typeof stats.goals !== "number") {
    // Используем заглушки, если данные не загрузились
    stats = {
      goals: 848,
      assists: 635,
      points: 1483,
      gamesPlayed: 1374,
    }
  }

  const statItems = [
    { label: "Goals", value: stats.goals, icon: <Trophy className="w-5 h-5 text-yellow-500" /> },
    { label: "Assists", value: stats.assists, icon: <Award className="w-5 h-5 text-blue-500" /> },
    { label: "Points", value: stats.points, icon: <Star className="w-5 h-5 text-purple-500" /> },
    { label: "Games Played", value: stats.gamesPlayed, icon: <Clock className="w-5 h-5 text-green-500" /> },
  ]

  // Add calculated stats
  const calculatedStats = [
    {
      label: "Goals Per Game",
      value: stats.gamesPlayed ? (stats.goals / stats.gamesPlayed).toFixed(2) : "0.00",
      icon: <TrendingUp className="w-5 h-5 text-red-400" />,
    },
    {
      label: "Points Per Game",
      value: stats.gamesPlayed ? (stats.points / stats.gamesPlayed).toFixed(2) : "0.00",
      icon: <Zap className="w-5 h-5 text-amber-400" />,
    },
  ]

  // Career highlights with years
  const careerHighlights = [
    { year: "2018", text: "Stanley Cup Champion with Washington Capitals" },
    { year: "2008, 2009, 2013, 2014, 2015, 2016, 2018, 2019, 2020", text: 'Maurice "Rocket" Richard Trophy winner' },
    { year: "2008, 2009, 2013", text: "Hart Memorial Trophy winner (NHL MVP)" },
    { year: "2006", text: "Calder Memorial Trophy (Rookie of the Year)" },
    { year: "2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2020", text: "NHL All-Star" },
    { year: "2020", text: "Became 8th player in NHL history to score 700 goals" },
    { year: "2022", text: "Became 3rd player in NHL history to score 800 goals" },
  ]

  return (
    <motion.div className="space-y-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div>
        <h2 className="text-2xl font-bold mb-6 font-squada">Career Statistics</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-gradient-to-br from-[#162b4d]/80 to-[#0a1930]/80 rounded-xl p-5 text-center relative overflow-hidden group border border-white/5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 * index, duration: 0.4 }}
              whileHover={{ y: -5 }}
            >
              {/* Decorative background element */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rotate-12 transform"></div>

              <div className="relative z-10">
                <div className="flex justify-center mb-3">
                  <div className="p-2 bg-[#0a1930] rounded-full">{stat.icon}</div>
                </div>

                <motion.div
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 font-squada"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400 text-sm mt-1 font-alegreya">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {calculatedStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-gradient-to-br from-[#162b4d]/80 to-[#0a1930]/80 rounded-xl p-5 relative overflow-hidden border border-white/5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + 0.2 * index, duration: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-[#0a1930] rounded-full mr-4">{stat.icon}</div>
                <div>
                  <div className="text-2xl font-bold font-squada">{stat.value}</div>
                  <div className="text-gray-400 text-sm font-alegreya">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 font-squada">Career Highlights</h2>
        <div className="bg-gradient-to-br from-[#162b4d]/80 to-[#0a1930]/80 rounded-xl p-6 border border-white/5">
          <ul className="space-y-4">
            {careerHighlights.map((highlight, index) => (
              <motion.li
                key={index}
                className="flex"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
              >
                <div className="mr-4 min-w-[80px] text-[#e74c3c] font-semibold font-squada text-2xl">{highlight.year}</div>
                <div className="font-alegreya text-xl">{highlight.text}</div>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}
