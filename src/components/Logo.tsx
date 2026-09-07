export function Logo({ className = 'h-11 w-11' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill="var(--color-cocoa-700)" />
      <circle cx="32" cy="32" r="31" fill="none" stroke="var(--color-terracotta-400)" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="2.6" fill="var(--color-cream)" />
      <circle cx="38" cy="22" r="2" fill="var(--color-cream)" />
      <circle cx="30" cy="34" r="2.3" fill="var(--color-cream)" />
      <circle cx="41" cy="33" r="1.8" fill="var(--color-cream)" />
      <circle cx="22" cy="38" r="1.7" fill="var(--color-cream)" />
      <circle cx="35" cy="43" r="2" fill="var(--color-cream)" />
      <path
        d="M32 12a20 20 0 1 0 20 20"
        fill="none"
        stroke="var(--color-terracotta-300)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
