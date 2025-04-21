export default function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-navy-950">
      <div className="w-16 h-16 border-4 border-navy-600 border-t-accent-red rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-bold text-white font-squada heading-loading-fix">Loading Ovechkin Stats...</h2>
      <p className="text-gray-400 mt-2 font-alegreya font-loading-fix">Fetching the latest goal data</p>
    </div>
  )
}
