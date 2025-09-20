import { useState, useEffect } from 'react';
import { useEmergencyFacilities } from '@/react-app/hooks/useEmergencyFacilities';
import DisasterMap from '@/react-app/components/DisasterMap';
import FacilityCard from '@/react-app/components/FacilityCard';
import EnhancedButton from '@/react-app/components/EnhancedButton';
import EnhancedCard from '@/react-app/components/EnhancedCard';
import { EmergencyFacility, FacilityTypeConfig, AvailabilityConfig } from '@/shared/types';
import { 
  Hospital,
  Navigation,
  Phone,
  Crosshair,
  Bed,
  Ambulance,
  Users,
  Search,
  Target,
  Zap
} from 'lucide-react';

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export default function MapView() {
  const { facilities, loading: facilitiesLoading } = useEmergencyFacilities();
  const [selectedFacility, setSelectedFacility] = useState<EmergencyFacility | null>(null);
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<EmergencyFacility['type'] | 'all'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<EmergencyFacility['availability'] | 'all'>('all');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState<number>(10); // km
  const [sortBy, setSortBy] = useState<'distance' | 'availability' | 'capacity'>('distance');
  const [emergencyType, setEmergencyType] = useState<'general' | 'cardiac' | 'trauma' | 'pediatric' | 'maternity'>('general');

  // Get user's current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          // Fallback to Mumbai coordinates
          setUserLocation({
            latitude: 19.0760,
            longitude: 72.8777,
          });
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      // Fallback to Mumbai coordinates
      setUserLocation({
        latitude: 19.0760,
        longitude: 72.8777,
      });
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter and sort facilities
  const processedFacilities = facilities
    .filter(facility => {
      if (!facility.is_operational) return false;
      if (facilityTypeFilter !== 'all' && facility.type !== facilityTypeFilter) return false;
      if (availabilityFilter !== 'all' && facility.availability !== availabilityFilter) return false;
      
      // Filter by emergency type specialties
      if (emergencyType !== 'general' && facility.specialties) {
        const emergencySpecialties = {
          cardiac: ['Cardiology', 'Cardiac Surgery', 'Critical Care'],
          trauma: ['Trauma Care', 'Emergency Medicine', 'Surgery'],
          pediatric: ['Pediatrics', 'Pediatric Emergency'],
          maternity: ['Obstetrics', 'Gynecology', 'Maternity'],
        };
        
        const requiredSpecialties = emergencySpecialties[emergencyType as keyof typeof emergencySpecialties];
        if (!requiredSpecialties.some(specialty => 
          facility.specialties!.some(fs => fs.toLowerCase().includes(specialty.toLowerCase()))
        )) {
          return false;
        }
      }
      
      return true;
    })
    .map(facility => ({
      ...facility,
      distance: userLocation ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        facility.latitude,
        facility.longitude
      ) : 0,
    }))
    .filter(facility => !userLocation || facility.distance <= searchRadius)
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'availability':
          const availabilityOrder = { available: 0, limited: 1, full: 2, closed: 3 };
          return availabilityOrder[a.availability] - availabilityOrder[b.availability];
        case 'capacity':
          return (b.capacity || 0) - (a.capacity || 0);
        default:
          return 0;
      }
    });

  const stats = {
    total: processedFacilities.length,
    hospitals: processedFacilities.filter(f => f.type === 'hospital').length,
    available: processedFacilities.filter(f => f.availability === 'available').length,
    emergency_centers: processedFacilities.filter(f => f.type === 'emergency_center').length,
    avgDistance: processedFacilities.length > 0 
      ? processedFacilities.reduce((sum, f) => sum + f.distance, 0) / processedFacilities.length 
      : 0,
  };

  const handleEmergencyCall = () => {
    if (confirm('Call Emergency Services (102 - Ambulance)?')) {
      window.open('tel:102', '_self');
    }
  };

  const handleFacilityCall = (phone: string) => {
    if (confirm(`Call ${phone}?`)) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleDirections = (facility: EmergencyFacility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`;
    window.open(url, '_blank');
  };

  if (facilitiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Hospital className="w-7 h-7 text-red-600" />
            Nearby Hospital Mapping
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find nearest hospitals and emergency facilities • {stats.total} facilities within {searchRadius}km
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Emergency Call Button */}
          <EnhancedButton
            onClick={handleEmergencyCall}
            variant="primary"
            size="sm"
            icon={Phone}
            className="bg-red-600 hover:bg-red-700 text-white animate-pulse-glow"
          >
            Emergency 102
          </EnhancedButton>

          {/* Get Location Button */}
          <EnhancedButton
            onClick={getCurrentLocation}
            variant="secondary"
            size="sm"
            icon={locationLoading ? undefined : Crosshair}
            loading={locationLoading}
          >
            {userLocation ? 'Update Location' : 'Get Location'}
          </EnhancedButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <Hospital className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.hospitals}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Hospitals</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.available}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Available</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.emergency_centers}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Emergency Centers</p>
            </div>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Navigation className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgDistance.toFixed(1)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Avg Distance (km)</p>
            </div>
          </div>
        </EnhancedCard>
      </div>

      {/* Advanced Filters */}
      <EnhancedCard variant="glass" className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Emergency Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Emergency Type
            </label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value as any)}
              className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="general">General Emergency</option>
              <option value="cardiac">Cardiac Emergency</option>
              <option value="trauma">Trauma/Accident</option>
              <option value="pediatric">Pediatric Care</option>
              <option value="maternity">Maternity Care</option>
            </select>
          </div>

          {/* Facility Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Facility Type
            </label>
            <select
              value={facilityTypeFilter}
              onChange={(e) => setFacilityTypeFilter(e.target.value as any)}
              className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              {Object.entries(FacilityTypeConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Availability
            </label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              {Object.entries(AvailabilityConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Radius */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Radius
            </label>
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={50}>50 km</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="distance">Distance</option>
              <option value="availability">Availability</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>
        </div>
      </EnhancedCard>

      {/* Map and Facility List */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Map */}
        <div className="flex-1">
          <DisasterMap
            reports={[]}
            facilities={processedFacilities}
            showFacilities={true}
            facilityTypeFilter={facilityTypeFilter}
            onFacilitySelect={setSelectedFacility}
          />
        </div>

        {/* Facility List Sidebar */}
        <div className="w-96 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {selectedFacility ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Facility Details</h3>
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FacilityCard
                  facility={selectedFacility}
                  distance={selectedFacility.distance}
                  showDetails={true}
                  onCall={handleFacilityCall}
                  onDirections={handleDirections}
                />
                
                {/* Additional Emergency Actions */}
                <div className="mt-4 space-y-2">
                  <EnhancedButton
                    onClick={handleEmergencyCall}
                    variant="primary"
                    size="sm"
                    icon={Phone}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Call Emergency Services (102)
                  </EnhancedButton>
                  
                  {selectedFacility.phone && (
                    <EnhancedButton
                      onClick={() => handleFacilityCall(selectedFacility.phone!)}
                      variant="secondary"
                      size="sm"
                      icon={Phone}
                      className="w-full"
                    >
                      Call {selectedFacility.name}
                    </EnhancedButton>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Nearby Facilities ({processedFacilities.length})
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userLocation ? 'Sorted by distance from your location' : 'Enable location for distance sorting'}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {processedFacilities.slice(0, 20).map((facility) => {
                  const typeConfig = FacilityTypeConfig[facility.type];
                  const availabilityConfig = AvailabilityConfig[facility.availability];
                  
                  return (
                    <div
                      key={facility.id}
                      onClick={() => setSelectedFacility(facility)}
                      className="cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                          style={{ backgroundColor: typeConfig.color }}
                        >
                          {typeConfig.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                            {facility.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{typeConfig.label}</p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`
                              inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                              ${availabilityConfig.bg} ${availabilityConfig.color}
                            `}>
                              <span>{availabilityConfig.icon}</span>
                              <span>{availabilityConfig.label}</span>
                            </div>
                            
                            {userLocation && (
                              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                <Navigation className="w-3 h-3" />
                                <span className="font-medium">{facility.distance.toFixed(1)} km</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Quick Info */}
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            {facility.beds_available !== undefined && (
                              <div className="flex items-center gap-1">
                                <Bed className="w-3 h-3" />
                                <span>{facility.beds_available}</span>
                              </div>
                            )}
                            {facility.ambulances_available !== undefined && (
                              <div className="flex items-center gap-1">
                                <Ambulance className="w-3 h-3" />
                                <span>{facility.ambulances_available}</span>
                              </div>
                            )}
                            {facility.capacity && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{facility.capacity}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {processedFacilities.length === 0 && (
                  <div className="text-center py-8">
                    <Hospital className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No facilities found within {searchRadius}km
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Try increasing the search radius or updating your location
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
