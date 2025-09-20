import { useNavigate } from 'react-router';
import EmergencyContacts from '@/react-app/components/EmergencyContacts';
import EnhancedButton from '@/react-app/components/EnhancedButton';
import { ArrowLeft, AlertTriangle, MapPin, Navigation } from 'lucide-react';

export default function EmergencyContactsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <EnhancedButton
            onClick={() => navigate(-1)}
            variant="ghost"
            icon={ArrowLeft}
            size="sm"
          >
            Back
          </EnhancedButton>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Emergency Contacts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Indian emergency service helplines
            </p>
          </div>
        </div>

        {/* Emergency Contacts */}
        <EmergencyContacts variant="full" showHeader={false} />

        {/* Additional Resources */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Additional Resources
          </h3>
          
          <div className="grid gap-4">
            <EnhancedButton
              onClick={() => navigate('/sos/request')}
              variant="gradient"
              size="lg"
              icon={AlertTriangle}
              className="w-full bg-gradient-to-r from-red-500 to-red-600"
            >
              Submit SOS Emergency Request
            </EnhancedButton>
            
            <EnhancedButton
              onClick={() => navigate('/map')}
              variant="secondary"
              size="lg"
              icon={MapPin}
              className="w-full"
            >
              View Emergency Map
            </EnhancedButton>
            
            <EnhancedButton
              onClick={() => navigate('/reports')}
              variant="ghost"
              size="lg"
              icon={Navigation}
              className="w-full"
            >
              Report Disaster
            </EnhancedButton>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
            🛡️ Emergency Safety Tips
          </h4>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <li>• Keep your phone charged and carry a power bank</li>
            <li>• Know your exact location (address/landmarks)</li>
            <li>• Stay calm and speak clearly when calling</li>
            <li>• Follow instructions from emergency responders</li>
            <li>• Keep important documents and medicines accessible</li>
            <li>• Have an emergency kit ready at home</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
