import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-[#E8000D] hover:bg-[#FF1A1A] text-white',
  ghost: 'border border-white/30 hover:border-[#E8000D] text-white hover:text-[#E8000D]',
  outline: 'border border-[#E8000D] text-[#E8000D] hover:bg-[#E8000D] hover:text-white',
  dark: 'bg-[#111111] hover:bg-[#1F1F1F] text-white border border-[#1F1F1F]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      className={`
        ${variants[variant]} ${sizes[size]}
        font-[Barlow] font-semibold rounded-lg transition-all duration-200
        flex items-center justify-center gap-2 ripple-effect
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </motion.button>
  )
}
