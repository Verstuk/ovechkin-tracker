export default function DiagonalDivider() {
  return (
    <div className="relative h-16 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a1930]"></div>
      <svg
        className="absolute bottom-0 w-full h-16 text-[#0a1930] fill-current"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M1200 120L0 16.48V0h1200v120z"></path>
      </svg>
    </div>
  )
}
