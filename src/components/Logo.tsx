export function Logo({ className = 'h-11 w-11' }: { className?: string }) {
  return (
    <img
      src="/images/logo.jpg"
      alt="Tamara Confeitaria Lab"
      className={`${className} shrink-0 rounded-full object-cover object-top`}
    />
  )
}
