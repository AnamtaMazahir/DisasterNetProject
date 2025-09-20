import { AlertTriangle, Shield, Zap } from 'lucide-react';

interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function SeverityBadge({ severity, confidence, size = 'md', showIcon = true }: SeverityBadgeProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const severityConfig = {
    low: {
      label: 'Low Risk',
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
      text: 'text-white',
      shadow: 'shadow-green-500/25',
      glow: 'hover:shadow-green-500/40',
      icon: Shield,
    },
    medium: {
      label: 'Medium Risk',
      gradient: 'bg-gradient-to-r from-orange-500 to-amber-600',
      text: 'text-white',
      shadow: 'shadow-orange-500/25',
      glow: 'hover:shadow-orange-500/40',
      icon: Zap,
    },
    high: {
      label: 'High Risk',
      gradient: 'bg-gradient-to-r from-red-500 to-rose-600',
      text: 'text-white',
      shadow: 'shadow-red-500/25',
      glow: 'hover:shadow-red-500/40',
      icon: AlertTriangle,
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <div className={`
        ${sizeClasses[size]} font-bold rounded-full transition-all duration-300
        ${config.gradient} ${config.text} ${config.shadow} ${config.glow}
        flex items-center shadow-lg hover:shadow-xl hover:scale-105
        backdrop-blur-sm border border-white/20
      `}>
        {showIcon && <Icon className={iconSize[size]} />}
        <span>{config.label}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${config.gradient}`}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-shimmer" />
        </div>
        <span className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">
          {(confidence * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
