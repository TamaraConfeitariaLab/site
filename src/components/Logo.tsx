export function Logo({ className = 'h-9' }: { className?: string }) {
  return (
    <img src="/images/logo-wordmark.png" alt="Tamara Confeitaria Lab" className={`${className} w-auto object-contain`} />
  )
}
