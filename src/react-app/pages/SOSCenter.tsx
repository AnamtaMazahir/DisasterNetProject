import { useState, useEffect } from 'react';
import { useSOSRequests } from '@/react-app/hooks/useSOSRequests';
import { useReports } from '@/react-app/hooks/useReports';
import DisasterMap from '@/react-app/components/DisasterMap';
import SOSRequestCard from '@/react-app/components/SOSRequestCard';
import EnhancedCard from '@/react-app/components/EnhancedCard';
import EnhancedButton from '@/react-app/components/EnhancedButton';
import EmergencyContacts from '@/react-app/components/EmergencyContacts';

import { 
  AlertCircle, 
  Users, 
  Clock, 
  Filter,
  RefreshCw,
  Play,
  Pause,
  Download,
  Phone,
  Radio,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';

export default function SOSCenter() {
  const { sosRequests, loading, acknowledgeRequest, markAsResponding, resolveRequest } = useSOSRequests();
  const { reports } = useReports();
  
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'acknowledged' | 'responding' | 'resolved'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredRequests = sosRequests.filter(request => {
    if (statusFilter !== 'all' && request.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && request.priority !== priorityFilter) return false;
    return true;
  });

  const stats = {
    total: sosRequests.length,
    pending: sosRequests.filter(r => r.status === 'pending').length,
    acknowledged: sosRequests.filter(r => r.status === 'acknowledged').length,
    responding: sosRequests.filter(r => r.status === 'responding').length,
    resolved: sosRequests.filter(r => r.status === 'resolved').length,
    critical: sosRequests.filter(r => r.priority === 'critical' && r.status !== 'resolved').length,
    high: sosRequests.filter(r => r.priority === 'high' && r.status !== 'resolved').length,
  };

  const handleExportRequests = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      summary: stats,
      requests: filteredRequests.map(request => ({
        id: request.id,
        name: request.name,
        priority: request.priority,
        status: request.status,
        people_count: request.people_count,
        situation: request.situation_description,
        medical_conditions: request.medical_conditions,
        location_description: request.location_description,
        coordinates: request.latitude && request.longitude ? 
          [request.latitude, request.longitude] : null,
        assigned_responder: request.assigned_responder,
        estimated_response_time: request.estimated_response_time,
        ai_assessment: request.ai_assessment,
        recommended_action: request.recommended_action,
        created_at: request.created_at,
        updated_at: request.updated_at,
      }))
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sos-requests-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-800 bg-clip-text text-transparent">
            SOS Emergency Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time monitoring and response coordination for emergency requests
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{stats.critical} Critical</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{stats.pending} Pending</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{stats.responding} Responding</span>
          </div>
          <EnhancedButton
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "primary" : "secondary"}
            size="sm"
            icon={autoRefresh ? Pause : Play}
          >
            {autoRefresh ? 'Live' : 'Paused'}
          </EnhancedButton>
          <EnhancedButton
            onClick={handleExportRequests}
            variant="secondary"
            size="sm"
            icon={Download}
          >
            Export
          </EnhancedButton>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.acknowledged}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Acknowledged</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.responding}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Responding</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolved}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.critical}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Critical Active</p>
            </div>
          </div>
        </EnhancedCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="responding">Responding</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* SOS Requests List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredRequests.length === 0 ? (
            <EnhancedCard variant="glass" className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No SOS Requests
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'No requests match the current filters.'
                  : 'No emergency requests at this time.'}
              </p>
            </EnhancedCard>
          ) : (
            <>
              {/* Critical requests first */}
              {filteredRequests
                .filter(r => r.priority === 'critical')
                .map((request) => (
                  <SOSRequestCard
                    key={request.id}
                    request={request}
                    onAcknowledge={acknowledgeRequest}
                    onRespond={markAsResponding}
                    onResolve={resolveRequest}
                    onViewDetails={() => {}}
                  />
                ))}
              
              {/* Then other priorities */}
              {filteredRequests
                .filter(r => r.priority !== 'critical')
                .sort((a, b) => {
                  const priorityOrder = { high: 0, medium: 1, low: 2 };
                  return priorityOrder[a.priority as keyof typeof priorityOrder] - 
                         priorityOrder[b.priority as keyof typeof priorityOrder];
                })
                .map((request) => (
                  <SOSRequestCard
                    key={request.id}
                    request={request}
                    onAcknowledge={acknowledgeRequest}
                    onRespond={markAsResponding}
                    onResolve={resolveRequest}
                    onViewDetails={() => {}}
                  />
                ))}
            </>
          )}
        </div>

        {/* Map and Quick Info */}
        <div className="space-y-4">
          <EnhancedCard variant="glass" className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-500" />
              Live Emergency Map
            </h3>
            <div className="h-80 rounded-xl overflow-hidden">
              <DisasterMap
                reports={reports}
                onReportSelect={() => {}} // Could integrate SOS with disaster reports
              />
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              🔴 SOS Requests • 🔵 Disaster Reports
            </div>
          </EnhancedCard>

          {/* Priority Queue */}
          <EnhancedCard variant="gradient" gradient="red" className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Priority Queue
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {sosRequests
                .filter(r => r.status !== 'resolved')
                .sort((a, b) => {
                  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                  return priorityOrder[a.priority as keyof typeof priorityOrder] - 
                         priorityOrder[b.priority as keyof typeof priorityOrder];
                })
                .slice(0, 5)
                .map((request) => (
                  <SOSRequestCard
                    key={request.id}
                    request={request}
                    compact={true}
                    onViewDetails={() => {}}
                  />
                ))}
            </div>
          </EnhancedCard>

          {/* Emergency Contacts */}
          <div className="mb-4">
            <EmergencyContacts variant="compact" />
          </div>

          {/* Quick Actions */}
          <EnhancedCard variant="glass" className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <EnhancedButton
                variant="gradient"
                size="sm"
                icon={Phone}
                className="w-full bg-gradient-to-r from-green-500 to-green-600"
              >
                Emergency Dispatch
              </EnhancedButton>
              <EnhancedButton
                variant="secondary"
                size="sm"
                icon={Radio}
                className="w-full"
              >
                Broadcast Alert
              </EnhancedButton>
              <EnhancedButton
                variant="ghost"
                size="sm"
                icon={RefreshCw}
                className="w-full"
                onClick={() => setLastUpdate(new Date())}
              >
                Refresh All
              </EnhancedButton>
            </div>
          </EnhancedCard>
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="lg:hidden fixed bottom-24 right-4 space-y-2">
        <button className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all animate-pulse">
          <Phone className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
          <Radio className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
