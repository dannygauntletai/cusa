interface GradientTextProps {
  children: React.ReactNode
  className?: string
  light?: boolean
}

export function GradientText({ children, className = '', light = false }: GradientTextProps) {
  return (
    <span className={`${light ? 'text-gradient-light' : 'text-gradient'} ${className}`}>
      {children}
    </span>
  )
} 