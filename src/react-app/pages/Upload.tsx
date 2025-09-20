import DirectUpload from '@/react-app/components/DirectUpload';
import SOSButton from '@/react-app/components/SOSButton';
import EnhancedCard from '@/react-app/components/EnhancedCard';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function Upload() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/" 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Report Incident
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload photos, videos, or describe what you're experiencing
          </p>
        </div>
      </div>

      {/* Main Upload Interface */}
      <EnhancedCard className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Disaster Reporting
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI will analyze your submission and automatically detect the type of disaster. 
            You can review and confirm the details before submitting your report.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <DirectUpload />
        </div>
      </EnhancedCard>
      
      {/* Floating SOS Button */}
      <SOSButton />
    </div>
  );
}
