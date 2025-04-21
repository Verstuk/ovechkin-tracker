"use client"

import { motion } from "framer-motion"

interface GoalMilestonesProps {
  currentGoals: number
}

export default function GoalMilestones({ currentGoals }: GoalMilestonesProps) {
  const milestones = [
    { goals: 100, date: "October 5, 2007", opponent: "Atlanta Thrashers", age: "22 years, 13 days" },
    { goals: 200, date: "February 5, 2009", opponent: "Los Angeles Kings", age: "23 years, 136 days" },
    { goals: 300, date: "April 5, 2011", opponent: "Toronto Maple Leafs", age: "25 years, 195 days" },
    { goals: 400, date: "December 20, 2013", opponent: "Carolina Hurricanes", age: "28 years, 89 days" },
    { goals: 500, date: "January 10, 2016", opponent: "Ottawa Senators", age: "30 years, 110 days" },
    { goals: 600, date: "March 12, 2018", opponent: "Winnipeg Jets", age: "32 years, 171 days" },
    { goals: 700, date: "February 22, 2020", opponent: "New Jersey Devils", age: "34 years, 153 days" },
    { goals: 800, date: "December 13, 2022", opponent: "Chicago Blackhawks", age: "37 years, 83 days" },
  ]

  // Add future milestones
  const futureMilestones = [
    { goals: 895, date: "Projected", opponent: "Wayne Gretzky's record", age: "TBD", future: true },
    { goals: 900, date: "Projected", opponent: "TBD", age: "TBD", future: true },
    { goals: 1000, date: "Projected", opponent: "TBD", age: "TBD", future: true },
  ]

  const allMilestones = [...milestones, ...futureMilestones]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {allMilestones.map((milestone) => {
        const isPassed = currentGoals >= milestone.goals
        const isNext =
          !isPassed &&
          milestone.goals === Math.min(...allMilestones.filter((m) => m.goals > currentGoals).map((m) => m.goals))

        return (
          <motion.div
            key={milestone.goals}
            className={`relative overflow-hidden rounded-lg border ${
              isNext
                ? "border-accent-red bg-accent-red/10"
                : isPassed
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-white/10 bg-navy-800"
            }`}
            variants={item}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl font-bold font-squada">{milestone.goals}</span>
                {isPassed && (
                  <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">Achieved</span>
                )}
                {isNext && (
                  <span className="bg-accent-red/20 text-accent-red text-xs px-3 py-1 rounded-full animate-pulse">
                    Next Up
                  </span>
                )}
              </div>

              <div className="space-y-2 font-alegreya">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 text-sm w-20">Date:</span>
                  <span className="text-white">{milestone.date}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 text-sm w-20">Opponent:</span>
                  <span className="text-white">{milestone.opponent}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 text-sm w-20">Age:</span>
                  <span className="text-white">{milestone.age}</span>
                </div>
              </div>

              {isNext && (
                <div className="mt-4">
                  <div className="h-2 bg-navy-900 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-accent-red to-accent-red-dark rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentGoals - (milestone.goals - 100)) / 100) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 font-alegreya">
                    {currentGoals - (milestone.goals - 100)}/100 goals to milestone
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
