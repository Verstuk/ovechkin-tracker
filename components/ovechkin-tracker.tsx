"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Share2, RefreshCw, Calendar, Trophy } from "lucide-react"
import GoalCounter from "./goal-counter"
import ProgressIndicator from "./progress-indicator"
import StatsSection from "./stats-section"
import GoalsBySeasonChart from "./goals-by-season-chart"
import GoalMilestones from "./goal-milestones"
import PhotoGallery from "./photo-gallery"
import NextGameCountdown from "./next-game-countdown"
import { Button } from "@/components/ui/button"
import SimpleTabs, { activateTab } from "./simple-tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import MainNavigation from "./main-navigation"
import AnimatedBackground from "./animated-background"
import ShareModal from "./share-modal"

interface PlayerStats {
  featuredStats: {
    regularSeason: {
      career: {
        goals: number
        assists: number
        points: number
        gamesPlayed: number
      }
      seasons?: Array<{
        season: number
        goals: number
        games: number
      }>
    }
  }
  firstName: string
  lastName: string
  headshot: string
}

// Seasonal data for the chart
const seasonalData = [
  { season: "2005-06", goals: 52, games: 81 },
  { season: "2006-07", goals: 46, games: 82 },
  { season: "2007-08", goals: 65, games: 82 },
  { season: "2008-09", goals: 56, games: 79 },
  { season: "2009-10", goals: 50, games: 72 },
  { season: "2010-11", goals: 32, games: 79 },
  { season: "2011-12", goals: 38, games: 78 },
  { season: "2012-13", goals: 32, games: 48 },
  { season: "2013-14", goals: 51, games: 78 },
  { season: "2014-15", goals: 53, games: 81 },
  { season: "2015-16", goals: 50, games: 79 },
  { season: "2016-17", goals: 33, games: 82 },
  { season: "2017-18", goals: 49, games: 82 },
  { season: "2018-19", goals: 51, games: 81 },
  { season: "2019-20", goals: 48, games: 68 },
  { season: "2020-21", goals: 24, games: 45 },
  { season: "2021-22", goals: 50, games: 77 },
  { season: "2022-23", goals: 42, games: 73 },
  { season: "2023-24", goals: 31, games: 79 },
]

// Next game data
const nextGameData = {
  opponent: "Pittsburgh Penguins",
  date: "2025-04-25T19:00:00",
  venue: "Capital One Arena",
  isHome: true,
}

// Fallback stats in case API fails
const fallbackStats: PlayerStats = {
  featuredStats: {
    regularSeason: {
      career: {
        goals: 848,
        assists: 635,
        points: 1483,
        gamesPlayed: 1374,
      },
      seasons: seasonalData,
    },
  },
  firstName: "Alexander",
  lastName: "Ovechkin",
  headshot: "/images/ovechkin-hero.png",
}

export default function OvechkinTracker() {
  const [stats, setStats] = useState<PlayerStats>(fallbackStats) // Initialize with fallback stats
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const { toast } = useToast()
  const { scrollYProgress } = useScroll()

  // Parallax effects
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/ovechkin-stats")

      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }

      const data = await response.json()

      // Add seasonal data to the fetched data
      const enhancedData = {
        ...data,
        featuredStats: {
          ...data.featuredStats,
          regularSeason: {
            ...data.featuredStats.regularSeason,
            seasons: seasonalData,
          },
        },
      }

      setStats(enhancedData)
      setLastUpdated(new Date())
      setError(null)

      toast({
        title: "Stats Updated",
        description: "Latest Ovechkin stats have been loaded",
        duration: 3000,
      })
    } catch (err) {
      console.error("Error fetching stats:", err)
      setError("Failed to load Ovechkin stats. Using fallback data.")

      // Use fallback data if API fails
      setStats(fallbackStats)
      setLastUpdated(new Date())

      toast({
        title: "Warning",
        description: "Using cached stats data. Couldn't connect to server.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Set up refresh every 6 hours
    const refreshInterval = setInterval(fetchData, 6 * 60 * 60 * 1000)

    // Add a class to prevent FOUC
    document.documentElement.classList.remove("loading")

    return () => clearInterval(refreshInterval)
  }, [])

  // Use stats directly since we initialize with fallback data
  const currentGoals = stats.featuredStats.regularSeason.career.goals
  const goalsToGo = 1000 - currentGoals
  const progressPercentage = (currentGoals / 1000) * 100

  // Определяем содержимое вкладок
  const tabsContent = [
    {
      id: "charts",
      label: "Season Charts",
      content: (
        <>
          <h3 className="text-2xl font-bold mb-6 font-squada heading-loading-fix">Goals by Season</h3>
          <GoalsBySeasonChart seasonData={stats.featuredStats.regularSeason.seasons || seasonalData} />
        </>
      ),
    },
    {
      id: "milestones",
      label: "Milestones",
      content: (
        <>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 font-squada heading-loading-fix">
            <Trophy size={20} className="text-yellow-500" /> Goal Milestones
          </h3>
          <GoalMilestones currentGoals={currentGoals} />
        </>
      ),
    },
    {
      id: "gallery",
      label: "Gallery",
      content: (
        <>
          <h3 className="text-2xl font-bold mb-6 font-squada heading-loading-fix">Photo Gallery</h3>
          <PhotoGallery />
        </>
      ),
    },
  ]

  // Функция для открытия модального окна шаринга
  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  return (
    <div className="relative no-fouc">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Top Navigation */}
      <MainNavigation />

      {/* Hero Section */}
      <section className="relative bg-navy-950 overflow-hidden animated-bg">
        <div className="absolute inset-0 z-0">
          <img src="/images/ovechkin-hero.png" alt="Alexander Ovechkin" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 to-transparent"></div>
        </div>

        {/* Animated ice particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="ice-particle"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            }}
          />
        ))}

        {/* Animated puck */}
        <div className="puck"></div>

        <motion.div
          className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col md:flex-row items-center"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
          }}
          initial={{ opacity: 1 }} // Ensure content is visible immediately
        >
          <div className="md:w-1/2 mb-8 md:mb-0">
            {/* Logo Box */}
            <motion.div
              className="bg-accent-red w-32 h-32 mb-6 flex flex-col items-center justify-center box-glow"
              initial={{ opacity: 1, x: 0 }} // Changed to ensure immediate visibility
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(231, 76, 60, 0.8)" }}
            >
              <span className="text-6xl font-bold font-squada heading-loading-fix">8</span>
              <span className="text-xs uppercase tracking-wider font-alegreya">Ovechkin</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-4 font-squada heading-loading-fix"
              initial={{ opacity: 1, y: 0 }} // Changed to ensure immediate visibility
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Comprehensive
              <br />
              Goal Tracker
            </motion.h1>

            <motion.div
              className="text-4xl md:text-6xl font-bold text-accent-red mb-6 font-squada heading-loading-fix text-glow"
              initial={{ opacity: 1, y: 0 }} // Changed to ensure immediate visibility
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              OVI! GIVE US 1000
            </motion.div>

            <motion.div
              initial={{ opacity: 1, y: 0 }} // Changed to ensure immediate visibility
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                className="bg-accent-red hover:bg-accent-red-dark text-white border-none uppercase tracking-wider shine font-alegreya"
                onClick={() => {
                  const statsSection = document.getElementById("stats-section")
                  if (statsSection) {
                    statsSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                View Stats
              </Button>
            </motion.div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <motion.div
              className="relative"
              initial={{ opacity: 1, scale: 1 }} // Changed to ensure immediate visibility
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <GoalCounter currentGoals={currentGoals} />
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-xl font-bold text-accent-red font-squada">{goalsToGo}</span>
                <span className="text-xl font-alegreya"> goals to 1000</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Diagonal divider */}
        <div className="h-16 relative overflow-hidden">
          <svg className="absolute bottom-0 w-full h-16" preserveAspectRatio="none" viewBox="0 0 1440 74">
            <path fill="#ffffff" fillOpacity="0.1" d="M0,0 L1440,0 L1440,74 L0,0 Z"></path>
          </svg>
        </div>
      </section>

      {/* Three Column Feature Section */}
      <section className="bg-navy-900 py-12 diagonal-stripes">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              className="bg-navy-800 p-6 relative overflow-hidden"
              initial={{ opacity: 1, y: 0 }} // Changed to ensure immediate visibility
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
            >
              <img src="/images/ovechkin-action.png" alt="Ovechkin Scoring" className="w-full h-48 object-cover mb-4" />
              <h3 className="text-2xl font-bold mb-2 font-squada heading-loading-fix">Goals</h3>
              <p className="text-gray-300 mb-4 font-alegreya font-loading-fix">
                Track Alexander Ovechkin's journey to becoming one of the greatest goal scorers in NHL history.
              </p>
              <Button
                variant="outline"
                className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white uppercase text-sm shine font-alegreya"
                onClick={() => {
                  const statsSection = document.getElementById("stats-section")
                  if (statsSection) {
                    statsSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                View Stats
              </Button>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-navy-800 p-6 relative overflow-hidden"
              initial={{ opacity: 1, y: 0 }} // Changed to ensure immediate visibility
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
            >
              <img
                src="/images/ovechkin-celebration.png"
                alt="Milestone Celebration"
                className="w-full h-48 object-cover mb-4"
              />
              <h3 className="text-2xl font-bold mb-2 font-squada heading-loading-fix">Milestones</h3>
              <p className="text-gray-300 mb-4 font-alegreya font-loading-fix">
                Explore the significant milestones in Ovechkin's career as he chases the all-time goal record.
              </p>
              <Button
                variant="outline"
                className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white uppercase text-sm shine font-alegreya"
                onClick={() => {
                  activateTab("milestones")
                }}
              >
                View Milestones
              </Button>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-navy-800 p-6 relative overflow-hidden"
              initial={{ opacity: 1, y: 0 }} // Changed to ensure immediate visibility
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
            >
              <img src="/images/ovechkin-700.png" alt="Ovechkin Gallery" className="w-full h-48 object-cover mb-4" />
              <h3 className="text-2xl font-bold mb-2 font-squada heading-loading-fix">Gallery</h3>
              <p className="text-gray-300 mb-4 font-alegreya font-loading-fix">
                Browse through a collection of memorable moments from Ovechkin's illustrious career.
              </p>
              <Button
                variant="outline"
                className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white uppercase text-sm shine font-alegreya"
                onClick={() => {
                  activateTab("gallery")
                }}
              >
                View Gallery
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="bg-accent-red py-16 animated-bg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 font-squada heading-loading-fix"
                initial={{ opacity: 1, y: 0 }} // Changed to ensure immediate visibility
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Be in the course of the game
              </motion.h2>
              <motion.p
                className="text-lg mb-6 font-alegreya font-loading-fix"
                initial={{ opacity: 1, y: 0 }} // Changed to ensure immediate visibility
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Follow Alexander Ovechkin's historic journey to 1000 goals and witness hockey history in the making.
              </motion.p>
              <motion.div
                initial={{ opacity: 1, y: 0 }} // Changed to ensure immediate visibility
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Button
                  className="bg-white text-accent-red hover:bg-gray-100 uppercase tracking-wider shine font-alegreya"
                  onClick={() => {
                    const nextGameSection = document.getElementById("next-game")
                    if (nextGameSection) {
                      nextGameSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  Next Game
                </Button>
              </motion.div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 1, scale: 1 }} // Changed to ensure immediate visibility
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <ProgressIndicator currentGoals={currentGoals} targetGoals={1000} percentage={progressPercentage} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="bg-navy-950 py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8 text-white text-center font-squada heading-loading-fix"
            initial={{ opacity: 1, y: 0 }} // Changed to ensure immediate visibility
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            About the Legend
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <StatsSection stats={stats.featuredStats.regularSeason.career} />
            </div>
            <div id="next-game">
              <motion.div
                className="bg-navy-800 p-6"
                initial={{ opacity: 1, x: 0 }} // Changed to ensure immediate visibility
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
              >
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 font-squada heading-loading-fix">
                  <Calendar size={20} /> Next Game
                </h3>
                <NextGameCountdown nextGame={nextGameData} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section id="tabs-section" className="bg-navy-950 py-16 animated-bg">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8 text-center font-squada heading-loading-fix text-glow"
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Explore Ovechkin's Journey
          </motion.h2>

          <SimpleTabs defaultTab="charts" tabs={tabsContent} />
        </div>
      </section>

      {/* Social Sharing Section */}
      <section className="bg-navy-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 font-squada heading-loading-fix">Share Ovi's Journey</h3>
              <p className="text-gray-300 font-alegreya font-loading-fix">
                Help spread the word about Ovechkin's historic chase for 1000 goals
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 border-accent-red text-accent-red hover:bg-accent-red hover:text-white shine font-alegreya"
                onClick={handleShare}
              >
                <Share2 size={18} /> Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer-section" className="bg-navy-950 border-t border-navy-700 py-8">
        <div className="container mx-auto px-4">
        <p className="mt-2 text-center">
              Contacts for sponsors: ovechkin.tracker@gmail.com
            </p>
          <div className="mt-8 pt-6 border-t border-navy-700 text-center text-gray-400 text-sm font-alegreya font-loading-fix">
            <p>© {new Date().getFullYear()} Mirniy Pixel. Ovechkin Goal Tracker. All rights reserved.</p>
            <p className="mt-2">
              Data provided by NHL API. This site is not affiliated with the NHL or Washington Capitals.
            </p>
            <p className="mt-2">
              Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "N/A"}
              <Button onClick={fetchData} variant="link" size="sm" className="text-gray-400 ml-2">
                <RefreshCw size={12} className="mr-1" /> Refresh
              </Button>
            </p>
          </div>
        </div>
      </footer>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`Alex Ovechkin has scored ${currentGoals} goals. ${goalsToGo} more to 1000!`}
        text={`Alex Ovechkin has scored ${currentGoals} goals. ${goalsToGo} more to 1000!`}
        url={typeof window !== "undefined" ? window.location.href : "https://ovechkin-tracker.vercel.app/"}
      />

      <Toaster />
    </div>
  )
}
