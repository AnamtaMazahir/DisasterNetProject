import { useState } from 'react';
import { useReports } from '@/react-app/hooks/useReports';
import { useDonations } from '@/react-app/hooks/useDonations';
import SOSButton from '@/react-app/components/SOSButton';
import ReportCard from '@/react-app/components/ReportCard';
import DisasterMap from '@/react-app/components/DisasterMap';
import EnhancedCard from '@/react-app/components/EnhancedCard';
import EnhancedButton from '@/react-app/components/EnhancedButton';
import DonationCard from '@/react-app/components/DonationCard';
import DirectUpload from '@/react-app/components/DirectUpload';
import { DisasterReport } from '@/shared/types';
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Clock,
  MapPin,
  Activity,
  Zap,
  Shield,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router';

export default function Dashboard() {
  const { reports, loading, updateReportStatus } = useReports();
  const { getDonationStats } = useDonations();
  const [selectedReport, setSelectedReport] = useState<DisasterReport | null>(null);
  const donationStats = getDonationStats();

  const handleReportAction = (action: string, reportId: number) => {
    console.log(`Action: ${action} on report ${reportId}`);
    
    if (action === 'mark_safe') {
      updateReportStatus(reportId, 'confirmed');
    } else if (action === 'override') {
      updateReportStatus(reportId, 'overridden');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = {
    total: reports.length,
    high: reports.filter(r => r.severity === 'high').length,
    medium: reports.filter(r => r.severity === 'medium').length,
    low: reports.filter(r => r.severity === 'low').length,
    pending: reports.filter(r => r.status === 'pending').length,
    activeTeams: 3, // Mock data
    avgResponseTime: '12', // Mock data
  };

  const recentReports = reports.slice(0, 3);
  const highPriorityReports = reports.filter(r => r.severity === 'high');

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden">
        <EnhancedCard variant="gradient" gradient="blue" className="p-8">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to DisasterNet
                </h1>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  AI-powered disaster response coordination platform
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">System Online</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Activity className="w-4 h-4" />
                    <span className="font-medium">Real-time Monitoring</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <DirectUpload />
                <Link to="/rescue-planning">
                  <EnhancedButton variant="glass" size="lg" icon={Users} className="w-full sm:w-auto">
                    Rescue Planning
                  </EnhancedButton>
                </Link>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-2xl" />
        </EnhancedCard>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <EnhancedCard variant="glass" hover className="p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.high}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">High Priority</p>
            </div>
          </div>
          <div className="mt-3 flex items-center text-red-600 dark:text-red-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">Immediate attention</span>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" hover className="p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Reports</p>
            </div>
          </div>
          <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">Last 24 hours</span>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" hover className="p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeTeams}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Teams</p>
            </div>
          </div>
          <div className="mt-3 flex items-center text-green-600 dark:text-green-400">
            <Shield className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">Response ready</span>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" hover className="p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgResponseTime}m</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg Response</p>
            </div>
          </div>
          <div className="mt-3 flex items-center text-purple-600 dark:text-purple-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">Improving</span>
          </div>
        </EnhancedCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Overview */}
        <div className="lg:col-span-2">
          <EnhancedCard variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Live Situation Map
              </h2>
              <Link to="/map">
                <EnhancedButton variant="ghost" size="sm" icon={ChevronRight}>
                  View Full Map
                </EnhancedButton>
              </Link>
            </div>
            <div className="h-80 rounded-xl overflow-hidden">
              <DisasterMap
                reports={reports}
                onReportSelect={setSelectedReport}
              />
            </div>
            {selectedReport && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Selected: {selectedReport.title}
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedReport.location_name} • {selectedReport.severity} severity
                </p>
              </div>
            )}
          </EnhancedCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Donation Progress */}
          <DonationCard variant="compact" stats={donationStats} />
          
          {/* High Priority Alerts */}
          <EnhancedCard variant="gradient" gradient="red" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Priority Alerts
              </h3>
              <Link to="/rescue-planning">
                <EnhancedButton variant="secondary" size="sm">
                  Manage
                </EnhancedButton>
              </Link>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {highPriorityReports.length > 0 ? (
                highPriorityReports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-red-200 dark:border-red-800 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {report.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {report.location_name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full font-medium">
                        {(report.confidence * 100).toFixed(0)}% confidence
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        #{report.id}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No high priority alerts
                  </p>
                </div>
              )}
            </div>
          </EnhancedCard>

          {/* Quick Actions */}
          <EnhancedCard variant="glass" className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <DirectUpload />
              <div className="hidden">
                <Link to="/upload" className="block">
                  <EnhancedButton variant="gradient" size="sm" icon={Plus} fullWidth>
                    Report New Incident
                  </EnhancedButton>
                </Link>
              </div>
              <Link to="/rescue-planning" className="block">
                <EnhancedButton variant="primary" size="sm" icon={Users} fullWidth>
                  Coordinate Response
                </EnhancedButton>
              </Link>
              <Link to="/reports" className="block">
                <EnhancedButton variant="secondary" size="sm" icon={Activity} fullWidth>
                  View All Reports
                </EnhancedButton>
              </Link>
            </div>
          </EnhancedCard>
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Reports
          </h2>
          <Link to="/reports">
            <EnhancedButton variant="ghost" icon={ChevronRight}>
              View All Reports
            </EnhancedButton>
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {recentReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onAction={handleReportAction}
              showActions={false}
            />
          ))}
        </div>
      </div>
      
      {/* Floating SOS Button */}
      <SOSButton />
    </div>
  );
}
