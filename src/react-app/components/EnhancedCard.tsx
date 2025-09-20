import { ReactNode } from 'react';

interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'glow';
  hover?: boolean;
  gradient?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function EnhancedCard({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  gradient = 'blue',
  style,
  onClick
}: EnhancedCardProps) {
  const baseClasses = "rounded-2xl transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg",
    glass: "glass-card shadow-glass",
    gradient: `bg-gradient-to-br ${
      gradient === 'blue' ? 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800' :
      gradient === 'purple' ? 'from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800' :
      gradient === 'green' ? 'from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800' :
      gradient === 'red' ? 'from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800' :
      'from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800'
    }`,
    glow: `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-glow ${
      gradient === 'blue' ? 'glow-blue' :
      gradient === 'purple' ? 'glow-purple' :
      gradient === 'green' ? 'glow-green' :
      'glow-red'
    }`
  };

  const hoverClasses = hover ? "hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1" : "";

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${onClick ? 'cursor-pointer' : ''} ${className}`} 
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
