"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TabsProps {
  defaultTab: string
  tabs: {
    id: string
    label: string
    content: React.ReactNode
  }[]
  className?: string
}

export default function SimpleTabs({ defaultTab, tabs, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Эффект для обработки внешних запросов на изменение активной вкладки
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      const tabId = event.detail?.tabId
      if (tabId && tabs.some((tab) => tab.id === tabId)) {
        setActiveTab(tabId)
      }
    }

    // Создаем слушатель пользовательского события
    window.addEventListener("changeTab" as any, handleTabChange as EventListener)

    return () => {
      window.removeEventListener("changeTab" as any, handleTabChange as EventListener)
    }
  }, [tabs])

  return (
    <div className={cn("w-full", className)}>
      {/* Заголовки вкладок */}
      <div className="flex rounded-md overflow-hidden grid grid-cols-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${tab.id}-tab`}
            className={cn(
              "flex-1 py-3 px-4 text-center transition-all relative font-anton",
              activeTab === tab.id ? "bg-accent-red text-white" : "bg-navy-800 text-gray-300 hover:text-white",
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                layoutId="activeTab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Содержимое вкладок */}
      {tabs.map(
        (tab) =>
          activeTab === tab.id && (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {tab.content}
            </motion.div>
          ),
      )}
    </div>
  )
}

// Вспомогательная функция для активации вкладки из любого места приложения
export function activateTab(tabId: string) {
  // Создаем и отправляем пользовательское событие
  const event = new CustomEvent("changeTab", { detail: { tabId } })
  window.dispatchEvent(event)

  // Прокручиваем к секции с вкладками
  setTimeout(() => {
    const tabsSection = document.getElementById("tabs-section")
    if (tabsSection) {
      tabsSection.scrollIntoView({ behavior: "smooth" })
    }
  }, 100)
}
