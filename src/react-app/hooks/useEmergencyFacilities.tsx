import { useState, useEffect } from 'react';
import { EmergencyFacility } from '@/shared/types';

// Mock data for Indian emergency facilities
const mockFacilities: EmergencyFacility[] = [
  // Mumbai Hospitals
  {
    id: 1,
    name: 'King Edward Memorial Hospital',
    type: 'hospital',
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
    latitude: 19.0176,
    longitude: 72.8431,
    phone: '+91 22 2414 3000',
    capacity: 1800,
    availability: 'available',
    specialties: ['Emergency Medicine', 'Trauma Care', 'ICU', 'Surgery'],
    is_operational: true,
    emergency_contact: '+91 22 2414 3001',
    beds_available: 45,
    ambulances_available: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Sir J.J. Group of Hospitals',
    type: 'hospital',
    address: 'Byculla, Mumbai, Maharashtra 400008',
    latitude: 18.9758,
    longitude: 72.8331,
    phone: '+91 22 2373 5555',
    capacity: 1500,
    availability: 'limited',
    specialties: ['General Medicine', 'Pediatrics', 'Emergency Care'],
    is_operational: true,
    emergency_contact: '+91 22 2373 5556',
    beds_available: 12,
    ambulances_available: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Lilavati Hospital',
    type: 'hospital',
    address: 'A-791, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050',
    latitude: 19.0544,
    longitude: 72.8208,
    phone: '+91 22 2640 0000',
    capacity: 323,
    availability: 'available',
    specialties: ['Cardiology', 'Neurology', 'Emergency Medicine', 'Critical Care'],
    is_operational: true,
    emergency_contact: '+91 22 2640 0001',
    beds_available: 28,
    ambulances_available: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  
  // Fire Stations
  {
    id: 4,
    name: 'Mumbai Fire Brigade HQ',
    type: 'fire_station',
    address: 'Byculla, Mumbai, Maharashtra 400027',
    latitude: 18.9754,
    longitude: 72.8318,
    phone: '101',
    capacity: 50,
    availability: 'available',
    is_operational: true,
    emergency_contact: '101',
    ambulances_available: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Bandra Fire Station',
    type: 'fire_station',
    address: 'Bandra West, Mumbai, Maharashtra 400050',
    latitude: 19.0596,
    longitude: 72.8295,
    phone: '101',
    capacity: 30,
    availability: 'available',
    is_operational: true,
    emergency_contact: '101',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Police Stations
  {
    id: 6,
    name: 'Colaba Police Station',
    type: 'police_station',
    address: 'Colaba, Mumbai, Maharashtra 400005',
    latitude: 18.9067,
    longitude: 72.8147,
    phone: '100',
    capacity: 40,
    availability: 'available',
    is_operational: true,
    emergency_contact: '100',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'Bandra Police Station',
    type: 'police_station',
    address: 'Bandra West, Mumbai, Maharashtra 400050',
    latitude: 19.0608,
    longitude: 72.8347,
    phone: '100',
    capacity: 35,
    availability: 'available',
    is_operational: true,
    emergency_contact: '100',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Emergency Centers
  {
    id: 8,
    name: 'Mumbai Emergency Response Center',
    type: 'emergency_center',
    address: 'BKC, Bandra East, Mumbai, Maharashtra 400051',
    latitude: 19.0625,
    longitude: 72.8643,
    phone: '1070',
    capacity: 100,
    availability: 'available',
    specialties: ['Disaster Response', 'Coordination', 'Emergency Management'],
    is_operational: true,
    emergency_contact: '1070',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Rescue Camps
  {
    id: 9,
    name: 'Shivaji Park Relief Camp',
    type: 'rescue_camp',
    address: 'Shivaji Park, Dadar, Mumbai, Maharashtra 400028',
    latitude: 19.0269,
    longitude: 72.8431,
    phone: '+91 22 2444 9999',
    capacity: 500,
    availability: 'available',
    specialties: ['Temporary Shelter', 'Food Distribution', 'Medical Aid'],
    is_operational: true,
    emergency_contact: '+91 22 2444 9998',
    beds_available: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 10,
    name: 'Oval Maidan Relief Center',
    type: 'rescue_camp',
    address: 'Oval Maidan, Churchgate, Mumbai, Maharashtra 400020',
    latitude: 18.9290,
    longitude: 72.8270,
    phone: '+91 22 2266 8888',
    capacity: 300,
    availability: 'limited',
    specialties: ['Emergency Shelter', 'Family Reunification'],
    is_operational: true,
    emergency_contact: '+91 22 2266 8887',
    beds_available: 35,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // More hospitals
  {
    id: 11,
    name: 'Hinduja Hospital',
    type: 'hospital',
    address: 'Veer Savarkar Marg, Mahim, Mumbai, Maharashtra 400016',
    latitude: 19.0330,
    longitude: 72.8397,
    phone: '+91 22 2445 2222',
    capacity: 350,
    availability: 'available',
    specialties: ['Cardiology', 'Orthopedics', 'Emergency Medicine'],
    is_operational: true,
    emergency_contact: '+91 22 2445 2223',
    beds_available: 22,
    ambulances_available: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 12,
    name: 'Breach Candy Hospital',
    type: 'hospital',
    address: 'Bhulabhai Desai Marg, Breach Candy, Mumbai, Maharashtra 400026',
    latitude: 18.9690,
    longitude: 72.8062,
    phone: '+91 22 2367 1888',
    capacity: 280,
    availability: 'available',
    specialties: ['Intensive Care', 'Emergency Medicine', 'Surgery'],
    is_operational: true,
    emergency_contact: '+91 22 2367 1889',
    beds_available: 18,
    ambulances_available: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export function useEmergencyFacilities() {
  const [facilities, setFacilities] = useState<EmergencyFacility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFacilities(mockFacilities);
      setLoading(false);
    }, 300);
  }, []);

  const getFacilitiesByType = (type: EmergencyFacility['type']) => {
    return facilities.filter(facility => facility.type === type);
  };

  const getAvailableFacilities = () => {
    return facilities.filter(facility => 
      facility.is_operational && 
      facility.availability !== 'closed'
    );
  };

  const getNearbyFacilities = (
    latitude: number, 
    longitude: number, 
    radius: number = 10 // km
  ) => {
    return facilities.filter(facility => {
      if (!facility.latitude || !facility.longitude) return false;
      
      // Simple distance calculation (approximate)
      const distance = Math.sqrt(
        Math.pow(facility.latitude - latitude, 2) + 
        Math.pow(facility.longitude - longitude, 2)
      ) * 111; // Convert to km (rough approximation)
      
      return distance <= radius;
    }).sort((a, b) => {
      const distanceA = Math.sqrt(
        Math.pow(a.latitude - latitude, 2) + 
        Math.pow(a.longitude - longitude, 2)
      ) * 111;
      const distanceB = Math.sqrt(
        Math.pow(b.latitude - latitude, 2) + 
        Math.pow(b.longitude - longitude, 2)
      ) * 111;
      return distanceA - distanceB;
    });
  };

  const updateFacilityAvailability = (
    id: number, 
    availability: EmergencyFacility['availability']
  ) => {
    setFacilities(prev => prev.map(facility => 
      facility.id === id 
        ? { ...facility, availability, updated_at: new Date().toISOString() }
        : facility
    ));
  };

  return {
    facilities,
    loading,
    getFacilitiesByType,
    getAvailableFacilities,
    getNearbyFacilities,
    updateFacilityAvailability,
  };
}
