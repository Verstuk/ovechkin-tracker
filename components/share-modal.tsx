"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, Twitter, Instagram, Linkedin, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  text: string
  url: string
}

export default function ShareModal({ isOpen, onClose, title, text, url }: ShareModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const shareOptions = [
    {
      name: "Twitter",
      icon: <Twitter size={20} />,
      color: "bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border-[#1DA1F2]/30",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        )
      },
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      color: "bg-[#0077B5]/20 hover:bg-[#0077B5]/30 border-[#0077B5]/30",
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
      },
    },
    {
      name: "Instagram",
      icon: <Instagram size={20} />,
      color: "bg-[#E4405F]/20 hover:bg-[#E4405F]/30 border-[#E4405F]/30",
      action: () => {
        // Instagram не имеет прямого API для шаринга, но можно открыть приложение
        toast({
          title: "Instagram",
          description: "Откройте Instagram и поделитесь скриншотом",
          duration: 3000,
        })
      },
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка скопирована в буфер обмена",
        duration: 3000,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать ссылку",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-navy-800 rounded-xl max-w-md w-full p-6 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold mb-4 font-squada">Поделиться</h3>
            <p className="text-gray-300 mb-6 font-alegreya">{title}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  size="lg"
                  className={`flex items-center gap-2 ${option.color}`}
                  onClick={option.action}
                >
                  {option.icon}
                  <span>{option.name}</span>
                </Button>
              ))}
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 bg-navy-900 rounded-lg p-3 pr-12 mb-4">
                <Link size={16} className="text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-300 truncate">{url}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-2"
                onClick={copyToClipboard}
                disabled={copied}
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </Button>
            </div>

            <Button className="w-full bg-accent-red hover:bg-accent-red-dark text-white mt-4" onClick={onClose}>
              Готово
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
