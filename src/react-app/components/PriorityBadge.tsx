import { PriorityConfig } from '@/shared/types';

interface PriorityBadgeProps {
  priority: 'critical' | 'high' | 'medium' | 'low';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function PriorityBadge({ 
  priority, 
  size = 'md', 
  showIcon = true 
}: PriorityBadgeProps) {
  const config = PriorityConfig[priority];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-bold
      ${config.bg} ${config.color} ${sizeClasses[size]}
    `}>
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
}
