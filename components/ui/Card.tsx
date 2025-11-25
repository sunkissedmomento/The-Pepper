interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white border border-gray-300 rounded p-6 ${className}`}>
      {children}
    </div>
  )
}