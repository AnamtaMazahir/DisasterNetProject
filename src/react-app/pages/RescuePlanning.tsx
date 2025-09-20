import { useState } from 'react';
import { useReports } from '@/react-app/hooks/useReports';
import DisasterMap from '@/react-app/components/DisasterMap';
import TeamAssignmentCard from '@/react-app/components/TeamAssignmentCard';
import ActionPlanCard from '@/react-app/components/ActionPlanCard';
import EnhancedButton from '@/react-app/components/EnhancedButton';
import EnhancedCard from '@/react-app/components/EnhancedCard';
import { DisasterReport } from '@/shared/types';
import { 
  MapPin, 
  Users, 
  FileText, 
  Download, 
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Filter,
  Navigation,
  Phone,
  Radio
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

const mockTeams: Team[] = [
  {
    id: 1,
    name: 'Alpha Medical',
    type: 'medical',
    members: 8,
    status: 'available',
    location: 'Station 1',
    equipment: ['Ambulances', 'Medical Supplies', 'Stretchers'],
  },
  {
    id: 2,
    name: 'Bravo Rescue',
    type: 'rescue',
    members: 12,
    status: 'deployed',
    location: 'En Route',
    equipment: ['Heavy Rescue', 'Cutting Tools', 'Ropes'],
    eta: '15 min',
    assignedReportId: 1,
  },
  {
    id: 3,
    name: 'Charlie Fire',
    type: 'fire',
    members: 6,
    status: 'available',
    location: 'Station 3',
    equipment: ['Fire Trucks', 'Foam', 'Hoses'],
  },
  {
    id: 4,
    name: 'Delta Police',
    type: 'police',
    members: 15,
    status: 'deployed',
    location: 'Downtown',
    equipment: ['Patrol Cars', 'Barriers', 'Communications'],
    eta: '8 min',
    assignedReportId: 3,
  },
  {
    id: 5,
    name: 'Echo Support',
    type: 'support',
    members: 10,
    status: 'available',
    location: 'Base Camp',
    equipment: ['Supply Trucks', 'Generators', 'Shelter'],
  },
];

// Generate action plans dynamically based on disaster reports
const generateActionPlans = (reports: DisasterReport[]): ActionPlan[] => {
  const plans: ActionPlan[] = [];
  let planId = 1;

  reports.forEach(report => {
    if (report.severity === 'high' || report.severity === 'medium') {
      const priority = report.severity === 'high' ? 1 : 
                      report.severity === 'medium' ? 2 : 3;
      
      let actions: string[] = [];
      let resources: string[] = [];
      let duration = '';
      let assignedTeams: number[] = [];

      // Generate actions based on disaster type and severity
      switch (report.disaster_type) {
        case 'earthquake':
          actions = [
            'Establish safety perimeter',
            'Search and rescue operations',
            'Structural damage assessment',
            'Medical triage setup',
            'Coordinate with utilities'
          ];
          resources = ['Heavy Rescue Equipment', 'Medical Supplies', 'Structural Engineers', 'Communications'];
          duration = report.severity === 'high' ? '6-8 hours' : '4-6 hours';
          assignedTeams = report.severity === 'high' ? [1, 2, 4] : [1, 2];
          break;
          
        case 'flood':
          actions = [
            'Water level monitoring',
            'Evacuation assistance',
            'Emergency shelter setup',
            'Supply distribution',
            'Damage assessment'
          ];
          resources = ['Boats', 'Life Jackets', 'Shelter Materials', 'Food & Water'];
          duration = report.severity === 'high' ? '4-6 hours' : '2-4 hours';
          assignedTeams = report.severity === 'high' ? [2, 5] : [5];
          break;
          
        case 'fire':
        case 'wildfire':
          actions = [
            'Evacuate affected area',
            'Fire suppression operations',
            'Air quality monitoring',
            'Medical treatment',
            'Perimeter establishment'
          ];
          resources = ['Fire Trucks', 'Foam', 'Air Quality Monitors', 'Medical Supplies'];
          duration = report.severity === 'high' ? '8-12 hours' : '4-6 hours';
          assignedTeams = report.severity === 'high' ? [1, 3, 4] : [3];
          break;
          
        case 'industrial_accident':
        case 'explosion':
          actions = [
            'Evacuate affected area',
            'Contain chemical spread',
            'Air quality monitoring',
            'Medical treatment',
            'Hazmat containment'
          ];
          resources = ['Hazmat Equipment', 'Air Monitors', 'Decontamination Units', 'Medical Supplies'];
          duration = report.severity === 'high' ? '6-10 hours' : '3-5 hours';
          assignedTeams = report.severity === 'high' ? [1, 3, 4] : [1, 4];
          break;
          
        default:
          actions = [
            'Area assessment',
            'Safety perimeter establishment',
            'Emergency response coordination',
            'Medical support'
          ];
          resources = ['Basic Equipment', 'Medical Supplies', 'Communications'];
          duration = report.severity === 'high' ? '4-6 hours' : '2-3 hours';
          assignedTeams = report.severity === 'high' ? [1, 2] : [1];
      }

      plans.push({
        id: planId++,
        reportId: report.id,
        priority,
        actions,
        assignedTeams,
        estimatedDuration: duration,
        resources,
        status: report.severity === 'high' ? 'in-progress' : 'planned',
      });
    }
  });

  return plans.sort((a, b) => a.priority - b.priority);
};

export default function RescuePlanning() {
  const { reports, loading } = useReports();
  const [selectedReport, setSelectedReport] = useState<DisasterReport | null>(null);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  
  // Generate action plans dynamically based on actual reports
  const actionPlans = generateActionPlans(reports);
  const [activeTab, setActiveTab] = useState<'map' | 'teams' | 'plans'>('map');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const highPriorityReports = reports.filter(r => r.severity === 'high');
  const mediumPriorityReports = reports.filter(r => r.severity === 'medium');
  const activeActionPlans = actionPlans.filter(p => p.status !== 'completed');
  
  // Auto-assign teams to high priority reports
  const autoAssignTeams = () => {
    const availableTeams = teams.filter(t => t.status === 'available');
    const highPriorityPlans = actionPlans.filter(p => p.priority === 1);
    
    highPriorityPlans.forEach((plan, index) => {
      if (index < availableTeams.length) {
        const team = availableTeams[index];
        setTeams(prev => prev.map(t => 
          t.id === team.id 
            ? { ...t, status: 'deployed', assignedReportId: plan.reportId, eta: '15 min' }
            : t
        ));
      }
    });
  };

  const handleAssignTeam = (teamId: number, reportId: number) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, status: 'deployed', assignedReportId: reportId, eta: '20 min' }
        : team
    ));
  };

  const handleExportPlan = () => {
    const planData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalReports: reports.length,
        highPriorityReports: highPriorityReports.length,
        mediumPriorityReports: mediumPriorityReports.length,
        activeTeams: teams.filter(t => t.status === 'deployed').length,
        availableTeams: teams.filter(t => t.status === 'available').length,
        activePlans: activeActionPlans.length,
      },
      actionPlans: activeActionPlans.map(plan => {
        const report = reports.find(r => r.id === plan.reportId);
        return {
          planId: plan.id,
          priority: plan.priority,
          priorityLabel: plan.priority === 1 ? 'Critical' : plan.priority === 2 ? 'High' : 'Medium',
          reportId: plan.reportId,
          reportTitle: report?.title,
          disasterType: report?.disaster_type,
          severity: report?.severity,
          confidence: report?.confidence,
          location: report?.location_name,
          assignedTeams: plan.assignedTeams.map(tid => {
            const team = teams.find(t => t.id === tid);
            return {
              id: tid,
              name: team?.name,
              type: team?.type,
              members: team?.members,
              status: team?.status,
              eta: team?.eta
            };
          }),
          actions: plan.actions,
          resources: plan.resources,
          duration: plan.estimatedDuration,
          status: plan.status,
        };
      }),
      teams: teams.map(team => ({
        id: team.id,
        name: team.name,
        type: team.type,
        members: team.members,
        status: team.status,
        location: team.location,
        equipment: team.equipment,
        assignedReport: team.assignedReportId ? {
          id: team.assignedReportId,
          title: reports.find(r => r.id === team.assignedReportId)?.title
        } : null,
        eta: team.eta,
      })),
    };

    const jsonContent = JSON.stringify(planData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `disaster-rescue-plan-${new Date().toISOString().split('T')[0]}-${new Date().toTimeString().split(' ')[0].replace(/:/g, '')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredReports = reports.filter(report => 
    priorityFilter === 'all' || report.severity === priorityFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Rescue Planning Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Coordinate emergency response operations and resource deployment
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{highPriorityReports.length} High Priority</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{mediumPriorityReports.length} Medium Priority</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{teams.filter(t => t.status === 'available').length} Teams Ready</span>
          </div>
          <EnhancedButton
            onClick={autoAssignTeams}
            variant="gradient"
            size="sm"
            icon={Zap}
          >
            Auto-Deploy
          </EnhancedButton>
          <EnhancedButton
            onClick={handleExportPlan}
            variant="secondary"
            size="sm"
            icon={Download}
          >
            Export Plan
          </EnhancedButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeActionPlans.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Plans</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{teams.filter(t => t.status === 'deployed').length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Teams Deployed</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {teams.filter(t => t.eta).reduce((total, team) => total + parseInt(team.eta || '0'), 0)}m
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg ETA</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{teams.filter(t => t.status === 'available').length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ready Units</p>
            </div>
          </div>
        </EnhancedCard>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {[
          { id: 'map', label: 'Strategic Map', icon: MapPin },
          { id: 'teams', label: 'Team Status', icon: Users },
          { id: 'plans', label: 'Action Plans', icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${activeTab === id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'map' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnhancedCard variant="glass" className="h-[600px] p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Strategic Overview
                </h3>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
              <div className="h-[520px]">
                <DisasterMap
                  reports={filteredReports}
                  onReportSelect={setSelectedReport}
                />
              </div>
            </EnhancedCard>
          </div>

          <div className="space-y-4">
            <EnhancedCard variant="gradient" gradient="red" className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-500" />
                Priority Incidents
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {/* High Priority Reports */}
                {highPriorityReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="p-3 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-red-200 dark:border-red-800"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {report.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {report.location_name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full">
                        {(report.confidence * 100).toFixed(0)}% confidence
                      </span>
                      {actionPlans.find(p => p.reportId === report.id) && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Plan Active
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Medium Priority Reports */}
                {mediumPriorityReports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="p-3 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-orange-200 dark:border-orange-800"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {report.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {report.location_name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
                        {(report.confidence * 100).toFixed(0)}% confidence
                      </span>
                      {actionPlans.find(p => p.reportId === report.id) && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Plan Ready
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </EnhancedCard>

            {selectedReport && (
              <EnhancedCard variant="glass" className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-500" />
                  Quick Deploy
                </h3>
                <div className="space-y-3">
                  {teams.filter(t => t.status === 'available').slice(0, 3).map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {team.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {team.members} members • {team.location}
                        </p>
                      </div>
                      <EnhancedButton
                        onClick={() => handleAssignTeam(team.id, selectedReport.id)}
                        variant="primary"
                        size="sm"
                      >
                        Deploy
                      </EnhancedButton>
                    </div>
                  ))}
                </div>
              </EnhancedCard>
            )}
          </div>
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {teams.map((team) => (
            <TeamAssignmentCard
              key={team.id}
              team={team}
              assignedReport={team.assignedReportId ? reports.find(r => r.id === team.assignedReportId) : undefined}
              onReassign={(teamId, reportId) => handleAssignTeam(teamId, reportId)}
            />
          ))}
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="space-y-6">
          {actionPlans.map((plan) => (
            <ActionPlanCard
              key={plan.id}
              plan={plan}
              report={reports.find(r => r.id === plan.reportId)!}
              assignedTeams={plan.assignedTeams.map(tid => teams.find(t => t.id === tid)!)}
            />
          ))}
        </div>
      )}

      {/* Mobile Quick Actions */}
      <div className="lg:hidden fixed bottom-20 right-4 space-y-2">
        <EnhancedButton
          onClick={() => handleExportPlan()}
          variant="gradient"
          size="lg"
          icon={Download}
          className="rounded-full w-14 h-14 p-0 shadow-2xl"
        />
        <div className="flex flex-col gap-2">
          <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
            <Phone className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
            <Radio className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
