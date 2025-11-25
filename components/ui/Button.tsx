'use client'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'outline',
  disabled = false,
  type = 'button',
  className = ''
}: ButtonProps) {
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 border border-black',
    outline: 'border border-black text-black bg-white hover:bg-gray-100',
    ghost: 'text-black hover:bg-gray-100'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded font-medium transition-all duration-200 ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}