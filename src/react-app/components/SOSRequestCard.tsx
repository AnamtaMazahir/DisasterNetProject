import { useState } from 'react';
import { SOSRequest, PriorityConfig } from '@/shared/types';
import EnhancedCard from './EnhancedCard';
import EnhancedButton from './EnhancedButton';
import { 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  CheckCircle, 
  ArrowRight,
  AlertTriangle,
  Heart,
  Navigation,
  Radio,
  User,
  Calendar
} from 'lucide-react';

interface SOSRequestCardProps {
  request: SOSRequest;
  onAcknowledge?: (id: number, responder: string, eta: string) => void;
  onRespond?: (id: number) => void;
  onResolve?: (id: number) => void;
  onViewDetails?: (request: SOSRequest) => void;
  compact?: boolean;
}

export default function SOSRequestCard({
  request,
  onAcknowledge,
  onRespond,
  onResolve,
  onViewDetails,
  compact = false
}: SOSRequestCardProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [responderName, setResponderName] = useState('');
  const [eta, setETA] = useState('');
  
  const priorityConfig = PriorityConfig[request.priority];
  const timeAgo = getTimeAgo(request.created_at);
  const lastUpdate = getTimeAgo(request.updated_at);

  function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }

  const handleQuickAcknowledge = () => {
    if (onAcknowledge) {
      const defaultResponder = 'Emergency Team';
      const defaultETA = request.priority === 'critical' ? '5 min' : 
                         request.priority === 'high' ? '10 min' : '15 min';
      onAcknowledge(request.id, defaultResponder, defaultETA);
    }
  };

  const handleCustomAcknowledge = () => {
    if (onAcknowledge && responderName && eta) {
      onAcknowledge(request.id, responderName, eta);
      setIsResponding(false);
      setResponderName('');
      setETA('');
    }
  };

  if (compact) {
    return (
      <EnhancedCard 
        variant="glass" 
        className={`p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 ${priorityConfig.border}`}
        onClick={() => onViewDetails?.(request)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${priorityConfig.bg.replace('bg-', 'bg-').replace('/30', '')}`} />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                {request.name}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {request.people_count} people • {timeAgo}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityConfig.bg} ${priorityConfig.color}`}>
              {priorityConfig.icon} {priorityConfig.label}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </EnhancedCard>
    );
  }

  return (
    <EnhancedCard 
      variant="glass" 
      className={`p-6 border-l-4 ${priorityConfig.border} ${
        request.status === 'pending' ? 'animate-pulse-border' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-2xl
            ${priorityConfig.bg}
          `}>
            {priorityConfig.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {request.name || 'Anonymous Request'}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {timeAgo}
              </span>
              {request.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {request.phone.replace(/(\+1)?(\d{3})(\d{3})(\d{4})/, '($2) $3-$4')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${priorityConfig.bg} ${priorityConfig.color}`}>
            {priorityConfig.label}
          </span>
          <div className={`
            w-3 h-3 rounded-full
            ${request.status === 'pending' ? 'bg-yellow-500 animate-pulse' :
              request.status === 'acknowledged' ? 'bg-blue-500' :
              request.status === 'responding' ? 'bg-orange-500' : 'bg-green-500'}
          `} />
        </div>
      </div>

      {/* Key Information Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">People</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {request.people_count}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Update</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {lastUpdate}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {request.location_description || 'GPS Coordinates'}
          </p>
        </div>
      </div>

      {/* Situation Description */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          Situation
        </h4>
        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          {request.situation_description}
        </p>
      </div>

      {/* Medical Conditions */}
      {request.medical_conditions && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            Medical Conditions
          </h4>
          <p className="text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            {request.medical_conditions}
          </p>
        </div>
      )}

      {/* AI Assessment */}
      {request.ai_assessment && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="w-4 h-4 text-purple-500">🤖</span>
            AI Assessment
          </h4>
          <p className="text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
            {request.ai_assessment}
          </p>
        </div>
      )}

      {/* Recommended Action */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-500" />
          Recommended Action
        </h4>
        <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 font-medium">
          {request.recommended_action}
        </p>
      </div>

      {/* Response Status */}
      {(request.assigned_responder || request.estimated_response_time) && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Response Status</h4>
          <div className="space-y-1 text-sm">
            {request.assigned_responder && (
              <p className="text-green-700 dark:text-green-300">
                <strong>Assigned to:</strong> {request.assigned_responder}
              </p>
            )}
            {request.estimated_response_time && (
              <p className="text-green-700 dark:text-green-300">
                <strong>ETA:</strong> {request.estimated_response_time}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {request.status === 'pending' && (
          <>
            <EnhancedButton
              onClick={handleQuickAcknowledge}
              variant="primary"
              icon={CheckCircle}
              className="flex-1"
            >
              Quick Acknowledge
            </EnhancedButton>
            
            <EnhancedButton
              onClick={() => setIsResponding(!isResponding)}
              variant="secondary"
              icon={User}
            >
              Custom Response
            </EnhancedButton>
          </>
        )}

        {request.status === 'acknowledged' && onRespond && (
          <EnhancedButton
            onClick={() => onRespond(request.id)}
            variant="gradient"
            icon={Navigation}
            className="flex-1"
          >
            Mark as Responding
          </EnhancedButton>
        )}

        {request.status === 'responding' && onResolve && (
          <EnhancedButton
            onClick={() => onResolve(request.id)}
            variant="primary"
            icon={CheckCircle}
            className="flex-1"
          >
            Mark as Resolved
          </EnhancedButton>
        )}

        <EnhancedButton
          onClick={() => onViewDetails?.(request)}
          variant="ghost"
          icon={MapPin}
        >
          View on Map
        </EnhancedButton>

        {request.phone && (
          <EnhancedButton
            onClick={() => window.open(`tel:${request.phone}`)}
            variant="ghost"
            icon={Phone}
          >
            Call
          </EnhancedButton>
        )}

        <EnhancedButton
          variant="ghost"
          icon={Radio}
        >
          Radio
        </EnhancedButton>
      </div>

      {/* Custom Response Form */}
      {isResponding && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border">
          <h5 className="font-medium text-gray-900 dark:text-white mb-3">Assign Response</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Responder/Team Name
              </label>
              <input
                type="text"
                value={responderName}
                onChange={(e) => setResponderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Rescue Team Alpha, John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estimated Response Time
              </label>
              <input
                type="text"
                value={eta}
                onChange={(e) => setETA(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 15 minutes"
              />
            </div>
            <div className="flex gap-2">
              <EnhancedButton
                onClick={handleCustomAcknowledge}
                disabled={!responderName || !eta}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                Acknowledge & Assign
              </EnhancedButton>
              <EnhancedButton
                onClick={() => setIsResponding(false)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </EnhancedButton>
            </div>
          </div>
        </div>
      )}
    </EnhancedCard>
  );
}
