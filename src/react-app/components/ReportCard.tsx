import { DisasterReport, DisasterTypes } from '@/shared/types';
import SeverityBadge from './SeverityBadge';
import EnhancedCard from './EnhancedCard';
import EnhancedButton from './EnhancedButton';
import { MapPin, Clock, CheckCircle, AlertTriangle, Send, Shield, FileText, AlertCircle } from 'lucide-react';

interface ReportCardProps {
  report: DisasterReport;
  onAction?: (action: string, reportId: number) => void;
  showActions?: boolean;
}

export default function ReportCard({ report, onAction, showActions = true }: ReportCardProps) {
  const disasterType = [...DisasterTypes.natural, ...DisasterTypes['man-made']]
    .find(type => type.id === report.disaster_type);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, report.id);
    }
  };

  

  return (
    <EnhancedCard 
      variant="glass" 
      className="overflow-hidden group animate-scale-in"
      hover={true}
    >
      {report.image_url && (
        <div className="aspect-video w-full overflow-hidden relative">
          <img 
            src={report.image_url} 
            alt={report.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              // Multiple fallback images based on disaster type
              const fallbackImages = {
                earthquake: 'https://images.unsplash.com/photo-1578661047720-1d99a8b0d6eb?w=800&auto=format&fit=crop&q=60',
                flood: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60',
                fire: 'https://images.unsplash.com/photo-1574870111867-089ad3a5de6d?w=800&auto=format&fit=crop&q=60',
                wildfire: 'https://images.unsplash.com/photo-1628890923662-2cb23c2e0742?w=800&auto=format&fit=crop&q=60',
                default: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&auto=format&fit=crop&q=60'
              };
              target.src = fallbackImages[report.disaster_type as keyof typeof fallbackImages] || fallbackImages.default;
              target.onerror = () => {
                // Final fallback if all else fails
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiNGMkY0RjciLz48Y2lyY2xlIGN4PSI0MDAiIGN5PSIyMjUiIHI9IjUwIiBmaWxsPSIjRDFEOEU0Ii8+PC9zdmc+';
              };
            }}
            onLoad={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              // Reset error handler for subsequent loads
              const target = e.target as HTMLImageElement;
              if (target) {
                target.onerror = (e: Event | string) => {
                  const img = (e as Event).target as HTMLImageElement;
                  const fallbackImages = {
                    earthquake: 'https://images.unsplash.com/photo-1578661047720-1d99a8b0d6eb?w=800&auto=format&fit=crop&q=60',
                    flood: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60',
                    fire: 'https://images.unsplash.com/photo-1574870111867-089ad3a5de6d?w=800&auto=format&fit=crop&q=60',
                    wildfire: 'https://images.unsplash.com/photo-1628890923662-2cb23c2e0742?w=800&auto=format&fit=crop&q=60',
                    default: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&auto=format&fit=crop&q=60'
                  };
                  img.src = fallbackImages[report.disaster_type as keyof typeof fallbackImages] || fallbackImages.default;
                };
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-3 right-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              report.severity === 'high' ? 'bg-red-500' :
              report.severity === 'medium' ? 'bg-orange-500' : 'bg-green-500'
            }`} />
          </div>
        </div>
      )}
      
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl animate-float">{disasterType?.icon}</div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                {report.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize font-medium">
                {report.category} • {disasterType?.label}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {report.status === 'confirmed' && (
              <div className="relative">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div className="absolute inset-0 bg-green-500 rounded-full blur opacity-30 animate-pulse" />
              </div>
            )}
            {report.status === 'overridden' && (
              <div className="relative">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                <div className="absolute inset-0 bg-orange-500 rounded-full blur opacity-30 animate-pulse" />
              </div>
            )}
            {report.status === 'pending' && (
              <div className="relative">
                <Clock className="w-6 h-6 text-blue-500 animate-spin-slow" />
                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-30 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {report.description && (
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            {report.description}
          </p>
        )}

        <SeverityBadge severity={report.severity} confidence={report.confidence} />

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold">
              AI Recommendation:
            </p>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
            {report.recommendation}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {report.location_name && (
              <div className="flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3" />
                {report.location_name}
              </div>
            )}
            <div className="flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(report.created_at)}
            </div>
          </div>
          <div className="text-xs font-mono text-gray-400">#{report.id}</div>
        </div>

        {showActions && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <EnhancedButton
              onClick={() => handleAction('dispatch')}
              variant="gradient"
              size="sm"
              icon={Send}
              className="flex-1 min-w-0"
            >
              Dispatch
            </EnhancedButton>
            <EnhancedButton
              onClick={() => handleAction('mark_safe')}
              variant="primary"
              size="sm"
              icon={Shield}
              className="flex-1 min-w-0"
            >
              Mark Safe
            </EnhancedButton>
            <EnhancedButton
              onClick={() => handleAction('request_assessment')}
              variant="secondary"
              size="sm"
              icon={FileText}
              className="flex-1 min-w-0"
            >
              Assess
            </EnhancedButton>
            <EnhancedButton
              onClick={() => handleAction('override')}
              variant="ghost"
              size="sm"
              icon={AlertTriangle}
              className="flex-1 min-w-0"
            >
              Override
            </EnhancedButton>
          </div>
        )}
      </div>
    </EnhancedCard>
  );
}
