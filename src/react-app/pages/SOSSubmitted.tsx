import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import EnhancedCard from '@/react-app/components/EnhancedCard';
import EnhancedButton from '@/react-app/components/EnhancedButton';
import EmergencyContacts from '@/react-app/components/EmergencyContacts';
import { PriorityConfig } from '@/shared/types';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Home,
  Zap,
  Shield
} from 'lucide-react';

export default function SOSSubmitted() {
  const location = useLocation();
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState(0);
  
  const { requestId, priority } = location.state || {};
  const priorityConfig = priority ? PriorityConfig[priority as keyof typeof PriorityConfig] : PriorityConfig.medium;

  useEffect(() => {
    if (!requestId) {
      navigate('/sos');
      return;
    }

    // Animation sequence
    const timeouts = [
      setTimeout(() => setAnimationStep(1), 500),
      setTimeout(() => setAnimationStep(2), 1500),
      setTimeout(() => setAnimationStep(3), 2500),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [requestId, navigate]);

  const getEstimatedResponseTime = () => {
    switch (priority) {
      case 'critical': return '5-8 minutes';
      case 'high': return '10-15 minutes';
      case 'medium': return '20-30 minutes';
      case 'low': return '30-60 minutes';
      default: return '15-30 minutes';
    }
  };

  const getResponseMessage = () => {
    switch (priority) {
      case 'critical': return 'Emergency response teams are being dispatched immediately to your location.';
      case 'high': return 'Urgent response teams are being notified and will respond as soon as possible.';
      case 'medium': return 'Your request has been logged and will be handled by available response teams.';
      case 'low': return 'Your request has been received and will be addressed when resources are available.';
      default: return 'Your emergency request has been received and is being processed.';
    }
  };

  if (!requestId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20 py-4 px-4">
      <div className="max-w-lg mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className={`
            w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
            transition-all duration-1000 ease-out
            ${animationStep >= 1 
              ? 'bg-gradient-to-br from-green-400 to-green-600 scale-100 shadow-2xl shadow-green-500/30' 
              : 'bg-gray-300 scale-50'
            }
          `}>
            <CheckCircle className={`
              w-12 h-12 text-white transition-all duration-500
              ${animationStep >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
            `} />
          </div>

          <div className={`
            transition-all duration-500 delay-300
            ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}>
            <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              SOS Request Sent!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Request ID: #{requestId}
            </p>
          </div>
        </div>

        {/* Priority Status */}
        <div className={`
          transition-all duration-500 delay-500 mb-6
          ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          <EnhancedCard variant="gradient" gradient={priority === 'critical' ? 'red' : priority === 'high' ? 'orange' : 'blue'} className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-3xl">{priorityConfig.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {priorityConfig.label} Priority
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {priorityConfig.description}
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {getResponseMessage()}
                </p>
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* Response Information */}
        <div className={`
          space-y-4 mb-8
          transition-all duration-500 delay-700
          ${animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          <EnhancedCard variant="glass" className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Estimated Response Time
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {getEstimatedResponseTime()}
                </p>
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard variant="glass" className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Response Status
                </h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium">
                  Emergency teams have been notified
                </p>
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard variant="glass" className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Location Tracking
                </h3>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  Response teams have your location
                </p>
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* Action Items */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
            What to do now:
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Stay where you are</strong> if it's safe. Don't move unless absolutely necessary.
              </p>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Keep your phone nearby</strong> and battery charged. Responders may contact you.
              </p>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                <strong>Signal for help</strong> if you see or hear rescue teams approaching.
              </p>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                4
              </div>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <strong>Call emergency services</strong> (use numbers above) directly if the situation becomes life-threatening.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-6">
          <EmergencyContacts variant="compact" showHeader={true} />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <EnhancedButton
            onClick={() => navigate('/sos')}
            variant="primary"
            size="lg"
            icon={Zap}
            className="w-full"
          >
            Track Response Status
          </EnhancedButton>
          
          <EnhancedButton
            onClick={() => navigate('/')}
            variant="secondary"
            size="lg"
            icon={Home}
            className="w-full"
          >
            Return to Dashboard
          </EnhancedButton>
        </div>

        {/* Legal Notice */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            Your SOS request has been logged and transmitted to emergency response systems. 
            Response times may vary based on current conditions and resource availability. 
            In immediate life-threatening situations, always call the emergency numbers above directly.
          </p>
        </div>
      </div>
    </div>
  );
}
