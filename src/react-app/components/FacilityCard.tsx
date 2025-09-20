import { EmergencyFacility, FacilityTypeConfig, AvailabilityConfig } from '@/shared/types';
import EnhancedCard from './EnhancedCard';
import EnhancedButton from './EnhancedButton';
import { 
  Phone, 
  MapPin, 
  Navigation, 
  Users, 
  Bed, 
  Ambulance,
  Clock
} from 'lucide-react';

interface FacilityCardProps {
  facility: EmergencyFacility;
  distance?: number;
  onDirections?: (facility: EmergencyFacility) => void;
  onCall?: (phone: string) => void;
  showDetails?: boolean;
}

export default function FacilityCard({ 
  facility, 
  distance,
  onDirections, 
  onCall,
  showDetails = true
}: FacilityCardProps) {
  const typeConfig = FacilityTypeConfig[facility.type];
  const availabilityConfig = AvailabilityConfig[facility.availability];

  const handleCall = () => {
    if (facility.phone && onCall) {
      onCall(facility.phone);
    } else if (facility.phone) {
      window.open(`tel:${facility.phone}`, '_self');
    }
  };

  const handleDirections = () => {
    if (onDirections) {
      onDirections(facility);
    } else {
      // Open Google Maps with directions
      const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <EnhancedCard 
      variant="glass" 
      hover 
      className="p-4 group"
      gradient={
        facility.availability === 'available' ? 'green' :
        facility.availability === 'limited' ? 'orange' :
        facility.availability === 'full' ? 'red' : 'blue'
      }
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg group-hover:scale-110 transition-transform"
          style={{ backgroundColor: typeConfig.color }}
        >
          {typeConfig.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                {facility.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {typeConfig.label}
              </p>
            </div>
            
            {/* Availability Badge */}
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
              ${availabilityConfig.bg} ${availabilityConfig.color}
            `}>
              <span>{availabilityConfig.icon}</span>
              <span>{availabilityConfig.label}</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{facility.address}</span>
          </div>

          {/* Distance */}
          {distance && (
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-3">
              <Navigation className="w-3 h-3" />
              <span className="font-medium">{distance.toFixed(1)} km away</span>
              {facility.estimated_travel_time && (
                <>
                  <Clock className="w-3 h-3 ml-1" />
                  <span>{facility.estimated_travel_time}</span>
                </>
              )}
            </div>
          )}

          {/* Capacity & Availability Info */}
          {showDetails && (
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              {facility.capacity && (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Users className="w-3 h-3" />
                  <span>Capacity: {facility.capacity}</span>
                </div>
              )}
              {facility.beds_available !== undefined && (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Bed className="w-3 h-3" />
                  <span>Beds: {facility.beds_available}</span>
                </div>
              )}
              {facility.ambulances_available !== undefined && (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Ambulance className="w-3 h-3" />
                  <span>Ambulances: {facility.ambulances_available}</span>
                </div>
              )}
            </div>
          )}

          {/* Specialties */}
          {facility.specialties && facility.specialties.length > 0 && showDetails && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {facility.specialties.slice(0, 3).map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium"
                  >
                    {specialty}
                  </span>
                ))}
                {facility.specialties.length > 3 && (
                  <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{facility.specialties.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {facility.phone && (
              <EnhancedButton
                onClick={handleCall}
                variant="primary"
                size="sm"
                icon={Phone}
                className="flex-1"
              >
                Call
              </EnhancedButton>
            )}
            <EnhancedButton
              onClick={handleDirections}
              variant="secondary"
              size="sm"
              icon={Navigation}
              className="flex-1"
            >
              Directions
            </EnhancedButton>
          </div>
        </div>
      </div>
    </EnhancedCard>
  );
}
