import { DisasterReport } from '@/shared/types';
import EnhancedCard from './EnhancedCard';
import EnhancedButton from './EnhancedButton';
import SeverityBadge from './SeverityBadge';
import { 
  FileText, 
  Clock, 
  Users, 
  CheckCircle, 
  Circle,
  PlayCircle,
  PauseCircle,
  Truck,
  AlertTriangle,
  MapPin,
  ArrowRight
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

interface ActionPlan {
  id: number;
  reportId: number;
  priority: 1 | 2 | 3;
  actions: string[];
  assignedTeams: number[];
  estimatedDuration: string;
  resources: string[];
  status: 'planned' | 'in-progress' | 'completed';
}

interface ActionPlanCardProps {
  plan: ActionPlan;
  report: DisasterReport;
  assignedTeams: Team[];
}

const priorityConfig = {
  1: { 
    label: 'Critical', 
    color: 'text-red-700 dark:text-red-300', 
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
    gradient: 'from-red-500 to-red-600'
  },
  2: { 
    label: 'High', 
    color: 'text-orange-700 dark:text-orange-300', 
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-300 dark:border-orange-700',
    gradient: 'from-orange-500 to-orange-600'
  },
  3: { 
    label: 'Medium', 
    color: 'text-yellow-700 dark:text-yellow-300', 
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
    gradient: 'from-yellow-500 to-yellow-600'
  },
};

const statusConfig = {
  planned: {
    label: 'Planned',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: Circle
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    icon: PlayCircle
  },
  completed: {
    label: 'Completed',
    color: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: CheckCircle
  },
};

export default function ActionPlanCard({ 
  plan, 
  report, 
  assignedTeams 
}: ActionPlanCardProps) {
  const priorityConfigData = priorityConfig[plan.priority];
  const statusConfigData = statusConfig[plan.status];
  const StatusIcon = statusConfigData.icon;

  const completedActions = plan.status === 'in-progress' ? Math.floor(plan.actions.length * 0.4) : 
                          plan.status === 'completed' ? plan.actions.length : 0;

  return (
    <EnhancedCard variant="glass" className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${priorityConfigData.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Action Plan #{plan.id}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {report.title}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 ${priorityConfigData.bg} rounded-full border ${priorityConfigData.border}`}>
              <AlertTriangle className={`w-4 h-4 ${priorityConfigData.color}`} />
              <span className={`text-sm font-medium ${priorityConfigData.color}`}>
                {priorityConfigData.label}
              </span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 ${statusConfigData.bg} rounded-full`}>
              <StatusIcon className={`w-4 h-4 ${statusConfigData.color}`} />
              <span className={`text-sm font-medium ${statusConfigData.color}`}>
                {statusConfigData.label}
              </span>
            </div>
          </div>
        </div>

        {/* Report Summary */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Incident Details
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">#{report.id}</span>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <SeverityBadge 
              severity={report.severity} 
              confidence={report.confidence} 
              size="sm" 
            />
            {report.location_name && (
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-3 h-3" />
                {report.location_name}
              </div>
            )}
          </div>
          {report.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {report.description}
            </p>
          )}
        </div>

        {/* Action Items */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            Action Items ({completedActions}/{plan.actions.length})
          </h4>
          <div className="space-y-2">
            {plan.actions.map((action, index) => {
              const isCompleted = index < completedActions;
              const isInProgress = index === completedActions && plan.status === 'in-progress';
              
              return (
                <div
                  key={index}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
                    ${isCompleted 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : isInProgress
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'
                    }
                  `}
                >
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500' 
                      : isInProgress
                      ? 'bg-blue-500 border-blue-500 animate-pulse'
                      : 'border-gray-300 dark:border-gray-600'
                    }
                  `}>
                    {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                    {isInProgress && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                  </div>
                  <span className={`
                    text-sm font-medium
                    ${isCompleted 
                      ? 'text-green-700 dark:text-green-300 line-through' 
                      : isInProgress
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'
                    }
                  `}>
                    {action}
                  </span>
                  {isInProgress && (
                    <div className="ml-auto flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                      Active
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources & Teams */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              Assigned Teams
            </h4>
            <div className="space-y-2">
              {assignedTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className={`
                    w-2 h-2 rounded-full
                    ${team.status === 'available' ? 'bg-green-500' :
                      team.status === 'deployed' ? 'bg-blue-500' : 'bg-orange-500'}
                  `} />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {team.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    {team.members} members
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-500" />
              Required Resources
            </h4>
            <div className="flex flex-wrap gap-1">
              {plan.resources.map((resource, index) => (
                <span
                  key={index}
                  className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full font-medium"
                >
                  {resource}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{plan.estimatedDuration}</span>
            </div>
            {plan.status === 'in-progress' && (
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <PlayCircle className="w-4 h-4" />
                <span className="font-medium">Active</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {plan.status === 'planned' && (
              <EnhancedButton
                variant="gradient"
                size="sm"
                icon={PlayCircle}
              >
                Start Plan
              </EnhancedButton>
            )}
            {plan.status === 'in-progress' && (
              <EnhancedButton
                variant="secondary"
                size="sm"
                icon={PauseCircle}
              >
                Pause
              </EnhancedButton>
            )}
            <EnhancedButton
              variant="ghost"
              size="sm"
              icon={ArrowRight}
            >
              Details
            </EnhancedButton>
          </div>
        </div>

        {/* Progress Bar */}
        {plan.status !== 'planned' && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round((completedActions / plan.actions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${priorityConfigData.gradient}`}
                style={{ width: `${(completedActions / plan.actions.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </EnhancedCard>
  );
}
