import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DisasterReport, EmergencyFacility, FacilityTypeConfig, AvailabilityConfig } from '@/shared/types';
import SeverityBadge from './SeverityBadge';
import EnhancedButton from './EnhancedButton';
import L from 'leaflet';
import { Phone, Navigation, Bed, Ambulance } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on severity
const createSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
  const colors = {
    low: '#22c55e',
    medium: '#f59e0b', 
    high: '#ef4444'
  };
  
  return L.divIcon({
    html: `<div style="background-color: ${colors[severity]}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    className: 'custom-marker'
  });
};

// Custom marker icons for emergency facilities
const createFacilityIcon = (facility: EmergencyFacility) => {
  const typeConfig = FacilityTypeConfig[facility.type];
  const availabilityColor = facility.availability === 'available' ? '#22c55e' :
                           facility.availability === 'limited' ? '#f59e0b' :
                           facility.availability === 'full' ? '#ef4444' : '#6b7280';
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${typeConfig.color}; 
        width: 28px; 
        height: 28px; 
        border-radius: 50%; 
        border: 3px solid white; 
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        position: relative;
      ">
        ${typeConfig.icon}
        <div style="
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background-color: ${availabilityColor};
          border: 1px solid white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    className: 'custom-facility-marker'
  });
};

interface DisasterMapProps {
  reports: DisasterReport[];
  facilities?: EmergencyFacility[];
  selectedCategory?: 'natural' | 'man-made' | 'all';
  showFacilities?: boolean;
  facilityTypeFilter?: EmergencyFacility['type'] | 'all';
  onReportSelect?: (report: DisasterReport) => void;
  onFacilitySelect?: (facility: EmergencyFacility) => void;
}

export default function DisasterMap({ 
  reports, 
  facilities = [],
  selectedCategory = 'all',
  showFacilities = false,
  facilityTypeFilter = 'all',
  onReportSelect,
  onFacilitySelect
}: DisasterMapProps) {
  const filteredReports = reports.filter(report => 
    report.latitude && report.longitude && 
    (selectedCategory === 'all' || report.category === selectedCategory)
  );

  const filteredFacilities = facilities.filter(facility => 
    facility.latitude && facility.longitude && 
    (facilityTypeFilter === 'all' || facility.type === facilityTypeFilter) &&
    facility.is_operational
  );

  const handleFacilityCall = (phone: string) => {
    if (confirm(`Call ${phone}?`)) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleFacilityDirections = (facility: EmergencyFacility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`;
    window.open(url, '_blank');
  };

  // Default center (Mumbai)
  const defaultCenter: [number, number] = [19.0760, 72.8777];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={defaultCenter}
        zoom={6}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {!showFacilities && filteredReports.map((report) => (
          <Marker
            key={`report-${report.id}`}
            position={[report.latitude!, report.longitude!]}
            icon={createSeverityIcon(report.severity)}
            eventHandlers={{
              click: () => onReportSelect?.(report)
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <h4 className="font-semibold text-sm mb-2">{report.title}</h4>
                <SeverityBadge severity={report.severity} confidence={report.confidence} size="sm" />
                <p className="text-xs text-gray-600 mt-2">{report.location_name}</p>
                {report.description && (
                  <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {showFacilities && filteredFacilities.map((facility) => {
          const typeConfig = FacilityTypeConfig[facility.type];
          const availabilityConfig = AvailabilityConfig[facility.availability];
          
          return (
            <Marker
              key={`facility-${facility.id}`}
              position={[facility.latitude!, facility.longitude!]}
              icon={createFacilityIcon(facility)}
              eventHandlers={{
                click: () => onFacilitySelect?.(facility)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-3 min-w-[250px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{typeConfig.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm">{facility.name}</h4>
                      <p className="text-xs text-gray-600">{typeConfig.label}</p>
                    </div>
                  </div>
                  
                  <div className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2
                    ${availabilityConfig.bg} ${availabilityConfig.color}
                  `}>
                    <span>{availabilityConfig.icon}</span>
                    <span>{availabilityConfig.label}</span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">{facility.address}</p>
                  
                  {(facility.beds_available !== undefined || facility.ambulances_available !== undefined) && (
                    <div className="flex gap-4 text-xs text-gray-600 mb-3">
                      {facility.beds_available !== undefined && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />
                          <span>{facility.beds_available} beds</span>
                        </div>
                      )}
                      {facility.ambulances_available !== undefined && (
                        <div className="flex items-center gap-1">
                          <Ambulance className="w-3 h-3" />
                          <span>{facility.ambulances_available}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {facility.phone && (
                      <EnhancedButton
                        onClick={() => handleFacilityCall(facility.phone!)}
                        variant="primary"
                        size="sm"
                        icon={Phone}
                        className="flex-1"
                      >
                        Call
                      </EnhancedButton>
                    )}
                    <EnhancedButton
                      onClick={() => handleFacilityDirections(facility)}
                      variant="secondary"
                      size="sm"
                      icon={Navigation}
                      className="flex-1"
                    >
                      Directions
                    </EnhancedButton>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
