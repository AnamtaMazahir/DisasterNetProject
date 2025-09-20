import { DisasterReport } from '@/shared/types';
import EnhancedCard from './EnhancedCard';
import EnhancedButton from './EnhancedButton';
import SeverityBadge from './SeverityBadge';
import { 
  Users, 
  MapPin, 
  Clock, 
  Truck, 
  Shield, 
  Activity,
  Radio,
  Navigation,
  AlertCircle
} from 'lucide-react';

interface Team {
  id: number;
  name: string;
  type: 'medical' | 'rescue' | 'fire' | 'police' | 'support';
  members: number;
  status: 'available' | 'deployed' | 'returning';
  location: string;
  equipment: string[];
  eta?: string;
  assignedReportId?: number;
}

interface TeamAssignmentCardProps {
  team: Team;
  assignedReport?: DisasterReport;
  onReassign: (teamId: number, reportId: number) => void;
}

const teamTypeConfig = {
  medical: { 
    color: 'text-green-600 dark:text-green-400', 
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: Shield,
    label: 'Medical'
  },
  rescue: { 
    color: 'text-orange-600 dark:text-orange-400', 
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    icon: Users,
    label: 'Rescue'
  },
  fire: { 
    color: 'text-red-600 dark:text-red-400', 
    bg: 'bg-red-100 dark:bg-red-900/30',
    icon: Activity,
    label: 'Fire'
  },
  police: { 
    color: 'text-blue-600 dark:text-blue-400', 
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: Shield,
    label: 'Police'
  },
  support: { 
    color: 'text-purple-600 dark:text-purple-400', 
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    icon: Truck,
    label: 'Support'
  },
};

const statusConfig = {
  available: {
    color: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: Shield,
    label: 'Available'
  },
  deployed: {
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: Navigation,
    label: 'Deployed'
  },
  returning: {
    color: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    icon: Clock,
    label: 'Returning'
  },
};

export default function TeamAssignmentCard({ 
  team, 
  assignedReport,
  onReassign 
}: TeamAssignmentCardProps) {
  const typeConfig = teamTypeConfig[team.type];
  const statusConfigData = statusConfig[team.status];
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfigData.icon;

  return (
    <EnhancedCard variant="glass" className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${typeConfig.bg} rounded-xl flex items-center justify-center`}>
              <TypeIcon className={`w-6 h-6 ${typeConfig.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {team.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {typeConfig.label} Unit
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 ${statusConfigData.bg} rounded-full`}>
            <StatusIcon className={`w-4 h-4 ${statusConfigData.color}`} />
            <span className={`text-sm font-medium ${statusConfigData.color}`}>
              {statusConfigData.label}
            </span>
          </div>
        </div>

        {/* Team Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {team.members} members
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {team.location}
            </span>
          </div>
          {team.eta && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                ETA: {team.eta}
              </span>
            </div>
          )}
        </div>

        {/* Equipment */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Equipment:
          </h4>
          <div className="flex flex-wrap gap-2">
            {team.equipment.map((item, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Assignment Details */}
        {assignedReport && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                Current Assignment:
              </h4>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
              {assignedReport.title}
            </p>
            <div className="flex items-center justify-between">
              <SeverityBadge 
                severity={assignedReport.severity} 
                confidence={assignedReport.confidence} 
                size="sm" 
              />
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                #{assignedReport.id}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {team.status === 'available' && (
            <EnhancedButton
              onClick={() => {
                // Mock quick assignment to highest priority report
                const highPriorityReport = assignedReport || { id: 1 } as DisasterReport;
                onReassign(team.id, highPriorityReport.id);
              }}
              variant="gradient"
              size="sm"
              icon={Navigation}
              className="flex-1"
            >
              Quick Deploy
            </EnhancedButton>
          )}
          
          {team.status === 'deployed' && (
            <>
              <EnhancedButton
                variant="secondary"
                size="sm"
                icon={Radio}
                className="flex-1"
              >
                Contact
              </EnhancedButton>
              <EnhancedButton
                variant="ghost"
                size="sm"
                icon={MapPin}
                className="flex-1"
              >
                Track
              </EnhancedButton>
            </>
          )}

          <EnhancedButton
            variant="ghost"
            size="sm"
            icon={Activity}
            className="flex-1"
          >
            Status
          </EnhancedButton>
        </div>

        {/* Progress Indicator for Deployed Teams */}
        {team.status === 'deployed' && team.eta && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>En Route</span>
              <span>{team.eta} remaining</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: '70%' }} // Mock progress
              />
            </div>
          </div>
        )}
      </div>
    </EnhancedCard>
  );
}
