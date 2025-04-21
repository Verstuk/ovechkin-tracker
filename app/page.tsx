import Script from "next/script"
import { Suspense } from "react"
import OvechkinTracker from "@/components/ovechkin-tracker"
import LoadingState from "@/components/loading-state"
import ErrorBoundary from "@/components/error-boundary"

export default function Home() {
  return (
    <main className="min-h-screen bg-navy-950 text-white">
      {/* Add script to prevent FOUC */}
      <Script id="prevent-fouc" strategy="beforeInteractive">
        {`
          // Add a loading class to prevent FOUC
          document.documentElement.classList.add('loading');
          
          // Remove the loading class after content is loaded
          window.addEventListener('DOMContentLoaded', () => {
            document.documentElement.classList.remove('loading');
          });
        `}
      </Script>

      <ErrorBoundary>
        <Suspense fallback={<LoadingState />}>
          <OvechkinTracker />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}
