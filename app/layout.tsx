import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Squada_One, Alegreya_Sans_SC } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Загрузка шрифта Squada One для заголовков с display: 'swap' для быстрой видимости
const squadaOne = Squada_One({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-squada-one",
  display: "swap",
  preload: true,
})

// Загрузка шрифта Alegreya Sans SC для основного текста с display: 'swap'
const alegreyaSansSC = Alegreya_Sans_SC({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-alegreya-sans-sc",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Ovechkin Goal Tracker | Road to 1000",
  description: "Track Alexander Ovechkin's journey to 1000 NHL goals with real-time statistics and updates.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to Google Fonts to speed up font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Font display fallback strategy */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @font-face {
            font-family: 'Squada One Fallback';
            size-adjust: 100%;
            ascent-override: 90%;
            src: local('Impact'), local('Arial Black');
            font-display: swap;
          }
          @font-face {
            font-family: 'Alegreya Sans SC Fallback';
            size-adjust: 100%;
            ascent-override: 90%;
            src: local('Arial'), local('Helvetica');
            font-display: swap;
          }
        `,
          }}
        />
      </head>
      <body className={`${squadaOne.variable} ${alegreyaSansSC.variable} font-alegreya bg-navy-950 text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
