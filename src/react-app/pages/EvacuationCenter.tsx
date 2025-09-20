import { useState, useEffect } from 'react';
import { useReports } from '@/react-app/hooks/useReports';
import DisasterMap from '@/react-app/components/DisasterMap';
import EnhancedCard from '@/react-app/components/EnhancedCard';
import EnhancedButton from '@/react-app/components/EnhancedButton';
import { 
  Camera, 
  Users, 
  Shield, 
  Navigation, 
  MapPin, 
  AlertTriangle,
  Route,
  Clock,
  Radio,
  Phone,
  Eye,
  Zap,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  UserCheck,
  Car,
  Footprints,
  Truck
} from 'lucide-react';

interface CCTVFeed {
  id: string;
  location: string;
  coordinates: [number, number];
  status: 'online' | 'offline' | 'maintenance';
  crowdDensity: 'low' | 'medium' | 'high' | 'critical';
  lastUpdate: string;
  isRecording: boolean;
  hasAudio: boolean;
  zoom: number;
  angle: number;
}

interface EvacuationRoute {
  id: string;
  name: string;
  start: [number, number];
  end: [number, number];
  waypoints: [number, number][];
  status: 'clear' | 'congested' | 'blocked' | 'emergency-only';
  estimatedTime: string;
  capacity: number;
  currentLoad: number;
  type: 'vehicle' | 'pedestrian' | 'emergency';
  lastUpdated: string;
}

interface Volunteer {
  id: string;
  name: string;
  location: [number, number];
  status: 'available' | 'assigned' | 'helping' | 'offline';
  specialization: 'guide' | 'medical' | 'traffic' | 'communication';
  assignedRoute?: string;
  peopleHelped: number;
  lastContact: string;
}

interface PoliceUnit {
  id: string;
  callSign: string;
  location: [number, number];
  status: 'patrolling' | 'responding' | 'directing' | 'available';
  officers: number;
  assignedArea: string;
  vehicleType: 'patrol' | 'motorcycle' | 'k9' | 'swat';
  lastUpdate: string;
}

// Mock CCTV feeds
const mockCCTVFeeds: CCTVFeed[] = [
  {
    id: 'cctv-001',
    location: 'CST Station & Fort Area',
    coordinates: [18.9401, 72.8352],
    status: 'online',
    crowdDensity: 'high',
    lastUpdate: '2 sec ago',
    isRecording: true,
    hasAudio: true,
    zoom: 1.2,
    angle: 45
  },
  {
    id: 'cctv-002',
    location: 'Bandra-Kurla Complex',
    coordinates: [19.0625, 72.8643],
    status: 'online',
    crowdDensity: 'critical',
    lastUpdate: '1 sec ago',
    isRecording: true,
    hasAudio: false,
    zoom: 2.1,
    angle: 90
  },
  {
    id: 'cctv-003',
    location: 'Marine Drive Promenade',
    coordinates: [18.9439, 72.8233],
    status: 'online',
    crowdDensity: 'medium',
    lastUpdate: '3 sec ago',
    isRecording: true,
    hasAudio: true,
    zoom: 1.0,
    angle: 180
  },
  {
    id: 'cctv-004',
    location: 'Juhu Beach Junction',
    coordinates: [19.0896, 72.8258],
    status: 'maintenance',
    crowdDensity: 'low',
    lastUpdate: '5 min ago',
    isRecording: false,
    hasAudio: false,
    zoom: 1.0,
    angle: 0
  }
];

// Mock evacuation routes
const mockEvacuationRoutes: EvacuationRoute[] = [
  {
    id: 'route-001',
    name: 'Primary North Exit - Bandra',
    start: [19.0760, 72.8777],
    end: [19.0544, 72.8406],
    waypoints: [[19.0650, 72.8600], [19.0600, 72.8500]],
    status: 'clear',
    estimatedTime: '12 min',
    capacity: 500,
    currentLoad: 180,
    type: 'pedestrian',
    lastUpdated: '30 sec ago'
  },
  {
    id: 'route-002',
    name: 'Eastern Express Highway South',
    start: [19.0760, 72.8777],
    end: [18.9750, 72.8258],
    waypoints: [[19.0250, 72.8500], [19.0000, 72.8400]],
    status: 'congested',
    estimatedTime: '25 min',
    capacity: 1000,
    currentLoad: 850,
    type: 'vehicle',
    lastUpdated: '1 min ago'
  },
  {
    id: 'route-003',
    name: 'Emergency Western Corridor',
    start: [19.0760, 72.8777],
    end: [19.0896, 72.8258],
    waypoints: [[19.0828, 72.8517]],
    status: 'emergency-only',
    estimatedTime: '8 min',
    capacity: 200,
    currentLoad: 45,
    type: 'emergency',
    lastUpdated: '15 sec ago'
  }
];

// Mock volunteers
const mockVolunteers: Volunteer[] = [
  {
    id: 'vol-001',
    name: 'Suresh Kumar',
    location: [19.0625, 72.8643],
    status: 'helping',
    specialization: 'guide',
    assignedRoute: 'route-001',
    peopleHelped: 23,
    lastContact: '2 min ago'
  },
  {
    id: 'vol-002',
    name: 'Anita Gupta',
    location: [19.0544, 72.8406],
    status: 'available',
    specialization: 'medical',
    peopleHelped: 8,
    lastContact: '5 min ago'
  },
  {
    id: 'vol-003',
    name: 'Vikram Singh',
    location: [18.9750, 72.8258],
    status: 'assigned',
    specialization: 'traffic',
    assignedRoute: 'route-002',
    peopleHelped: 15,
    lastContact: '1 min ago'
  }
];

// Mock police units
const mockPoliceUnits: PoliceUnit[] = [
  {
    id: 'unit-101',
    callSign: 'Mumbai-101',
    location: [19.0625, 72.8643],
    status: 'directing',
    officers: 2,
    assignedArea: 'BKC Area',
    vehicleType: 'patrol',
    lastUpdate: '30 sec ago'
  },
  {
    id: 'unit-202',
    callSign: 'Mumbai-202',
    location: [18.9439, 72.8233],
    status: 'responding',
    officers: 1,
    assignedArea: 'South Mumbai',
    vehicleType: 'motorcycle',
    lastUpdate: '1 min ago'
  }
];

export default function EvacuationCenter() {
  const { reports, loading } = useReports();
  const [cctvFeeds, setCctvFeeds] = useState<CCTVFeed[]>(mockCCTVFeeds);
  const [evacuationRoutes, setEvacuationRoutes] = useState<EvacuationRoute[]>(mockEvacuationRoutes);
  const [volunteers] = useState<Volunteer[]>(mockVolunteers);
  const [policeUnits] = useState<PoliceUnit[]>(mockPoliceUnits);
  const [activeTab, setActiveTab] = useState<'overview' | 'cctv' | 'routes' | 'personnel'>('overview');
  const [selectedFeed, setSelectedFeed] = useState<CCTVFeed | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Update CCTV feed timestamps and crowd density
      setCctvFeeds(prev => prev.map(feed => ({
        ...feed,
        lastUpdate: Math.random() > 0.7 ? 'Just now' : feed.lastUpdate,
        crowdDensity: Math.random() > 0.8 ? 
          (['low', 'medium', 'high', 'critical'] as const)[Math.floor(Math.random() * 4)] : 
          feed.crowdDensity
      })));

      // Update route congestion
      setEvacuationRoutes(prev => prev.map(route => ({
        ...route,
        currentLoad: Math.min(route.capacity, route.currentLoad + Math.floor(Math.random() * 20 - 10)),
        lastUpdated: Math.random() > 0.6 ? 'Just now' : route.lastUpdated
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const crowdDensityConfig = {
    low: { color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/30', icon: '🟢' },
    medium: { color: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: '🟡' },
    high: { color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: '🟠' },
    critical: { color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/30', icon: '🔴' }
  };

  const routeStatusConfig = {
    clear: { color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Clear' },
    congested: { color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-100 dark:bg-orange-900/30', label: 'Congested' },
    blocked: { color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Blocked' },
    'emergency-only': { color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Emergency Only' }
  };

  const activeIncidents = reports.filter(r => r.severity === 'high' || r.severity === 'medium');
  const totalEvacuees = evacuationRoutes.reduce((sum, route) => sum + route.currentLoad, 0);
  const availableVolunteers = volunteers.filter(v => v.status === 'available').length;
  const activePolice = policeUnits.filter(u => u.status !== 'available').length;

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
            Emergency Evacuation Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time CCTV monitoring, route optimization, and personnel coordination
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{cctvFeeds.filter(f => f.status === 'online').length} CCTV Online</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{totalEvacuees} Evacuating</span>
          </div>
          <EnhancedButton
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "primary" : "secondary"}
            size="sm"
            icon={autoRefresh ? Pause : Play}
          >
            {autoRefresh ? 'Live' : 'Paused'}
          </EnhancedButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeIncidents.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Incidents</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEvacuees}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Evacuating</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{availableVolunteers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Volunteers Ready</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activePolice}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Police Active</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Route className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{evacuationRoutes.filter(r => r.status === 'clear').length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clear Routes</p>
            </div>
          </div>
        </EnhancedCard>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {[
          { id: 'overview', label: 'Overview', icon: MapPin },
          { id: 'cctv', label: 'CCTV Feeds', icon: Camera },
          { id: 'routes', label: 'Evacuation Routes', icon: Route },
          { id: 'personnel', label: 'Personnel', icon: Users },
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
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnhancedCard variant="glass" className="h-[600px] p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Live Situation Map
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live Updates
                  </div>
                </div>
              </div>
              <div className="h-[520px]">
                <DisasterMap
                  reports={reports}
                />
              </div>
            </EnhancedCard>
          </div>

          <div className="space-y-4">
            {/* Critical CCTV Feeds */}
            <EnhancedCard variant="gradient" gradient="red" className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Camera className="w-5 h-5 text-red-500" />
                Critical Areas
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cctvFeeds.filter(feed => feed.crowdDensity === 'critical' || feed.crowdDensity === 'high').map((feed) => (
                  <div
                    key={feed.id}
                    onClick={() => setSelectedFeed(feed)}
                    className="p-3 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {feed.location}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${crowdDensityConfig[feed.crowdDensity].bg} ${crowdDensityConfig[feed.crowdDensity].color}`}>
                        {crowdDensityConfig[feed.crowdDensity].icon} {feed.crowdDensity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {feed.lastUpdate}
                      </span>
                      <div className="flex items-center gap-1">
                        {feed.isRecording && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                        {feed.hasAudio && <Volume2 className="w-3 h-3 text-gray-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </EnhancedCard>

            {/* Quick Route Status */}
            <EnhancedCard variant="glass" className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Route className="w-5 h-5 text-blue-500" />
                Route Status
              </h3>
              <div className="space-y-2">
                {evacuationRoutes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{route.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {route.currentLoad}/{route.capacity} people
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${routeStatusConfig[route.status].bg} ${routeStatusConfig[route.status].color}`}>
                      {routeStatusConfig[route.status].label}
                    </span>
                  </div>
                ))}
              </div>
            </EnhancedCard>
          </div>
        </div>
      )}

      {activeTab === 'cctv' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {selectedFeed ? (
              <EnhancedCard variant="glass" className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedFeed.location}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Feed ID: {selectedFeed.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${crowdDensityConfig[selectedFeed.crowdDensity].bg} ${crowdDensityConfig[selectedFeed.crowdDensity].color}`}>
                      {crowdDensityConfig[selectedFeed.crowdDensity].icon} {selectedFeed.crowdDensity} density
                    </span>
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Mock CCTV Feed Display */}
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Live CCTV Feed</p>
                      <p className="text-sm opacity-75">{selectedFeed.location}</p>
                      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          LIVE
                        </div>
                        <span>Zoom: {selectedFeed.zoom}x</span>
                        <span>Angle: {selectedFeed.angle}°</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Simulated crowd detection overlay */}
                  {selectedFeed.crowdDensity === 'critical' && (
                    <div className="absolute top-4 left-4 bg-red-500/80 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                      ⚠️ High Crowd Density Detected
                    </div>
                  )}
                </div>

                {/* CCTV Controls */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <EnhancedButton variant="secondary" size="sm" icon={Zap}>
                      Auto Track
                    </EnhancedButton>
                    <EnhancedButton variant="ghost" size="sm" icon={Navigation}>
                      Pan/Tilt
                    </EnhancedButton>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    Last update: {selectedFeed.lastUpdate}
                  </div>
                </div>
              </EnhancedCard>
            ) : (
              <EnhancedCard variant="glass" className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Select a CCTV feed to view</p>
                </div>
              </EnhancedCard>
            )}
          </div>

          <div>
            <EnhancedCard variant="glass" className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                CCTV Network
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cctvFeeds.map((feed) => (
                  <div
                    key={feed.id}
                    onClick={() => setSelectedFeed(feed)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border-2 ${
                      selectedFeed?.id === feed.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-transparent bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {feed.location}
                      </h4>
                      <div className={`w-2 h-2 rounded-full ${
                        feed.status === 'online' ? 'bg-green-500' :
                        feed.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${crowdDensityConfig[feed.crowdDensity].bg} ${crowdDensityConfig[feed.crowdDensity].color}`}>
                        {feed.crowdDensity}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {feed.lastUpdate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </EnhancedCard>
          </div>
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="space-y-6">
          {evacuationRoutes.map((route) => (
            <EnhancedCard key={route.id} variant="glass" className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    route.type === 'vehicle' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    route.type === 'pedestrian' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {route.type === 'vehicle' ? <Car className="w-6 h-6 text-blue-600" /> :
                     route.type === 'pedestrian' ? <Footprints className="w-6 h-6 text-green-600" /> :
                     <Truck className="w-6 h-6 text-red-600" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {route.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {route.type.charAt(0).toUpperCase() + route.type.slice(1)} Route • ETA: {route.estimatedTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${routeStatusConfig[route.status].bg} ${routeStatusConfig[route.status].color}`}>
                    {routeStatusConfig[route.status].label}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {route.currentLoad}/{route.capacity}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        (route.currentLoad / route.capacity) > 0.8 ? 'bg-red-500' :
                        (route.currentLoad / route.capacity) > 0.6 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (route.currentLoad / route.capacity) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Est. Time</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {route.estimatedTime}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Update</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {route.lastUpdated}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{route.waypoints.length} waypoints</span>
                </div>
                <div className="flex items-center gap-2">
                  <EnhancedButton variant="primary" size="sm" icon={Navigation}>
                    Optimize Route
                  </EnhancedButton>
                  <EnhancedButton variant="secondary" size="sm" icon={Radio}>
                    Broadcast
                  </EnhancedButton>
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>
      )}

      {activeTab === 'personnel' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Volunteers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              Volunteers ({volunteers.length})
            </h3>
            <div className="space-y-4">
              {volunteers.map((volunteer) => (
                <EnhancedCard key={volunteer.id} variant="glass" className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        volunteer.status === 'available' ? 'bg-green-500' :
                        volunteer.status === 'helping' ? 'bg-blue-500' :
                        volunteer.status === 'assigned' ? 'bg-orange-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {volunteer.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {volunteer.specialization} specialist
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Helped {volunteer.peopleHelped} people
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last contact: {volunteer.lastContact}
                    </span>
                    <div className="flex items-center gap-2">
                      <EnhancedButton variant="ghost" size="sm" icon={Phone}>
                        Contact
                      </EnhancedButton>
                      {volunteer.status === 'available' && (
                        <EnhancedButton variant="primary" size="sm" icon={Navigation}>
                          Assign
                        </EnhancedButton>
                      )}
                    </div>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          </div>

          {/* Police Units */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Police Units ({policeUnits.length})
            </h3>
            <div className="space-y-4">
              {policeUnits.map((unit) => (
                <EnhancedCard key={unit.id} variant="glass" className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center`}>
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {unit.callSign}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {unit.vehicleType} • {unit.officers} officers
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      unit.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      unit.status === 'responding' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {unit.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Area: {unit.assignedArea}</p>
                      <p className="text-xs">Updated: {unit.lastUpdate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <EnhancedButton variant="ghost" size="sm" icon={Radio}>
                        Radio
                      </EnhancedButton>
                      <EnhancedButton variant="secondary" size="sm" icon={MapPin}>
                        Track
                      </EnhancedButton>
                    </div>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
