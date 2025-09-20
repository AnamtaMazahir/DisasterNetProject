import z from "zod";

export const DisasterReportSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  disaster_type: z.string(),
  category: z.enum(['natural', 'man-made']),
  severity: z.enum(['low', 'medium', 'high']),
  confidence: z.number().min(0).max(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  location_name: z.string().optional(),
  image_url: z.string().optional(),
  recommendation: z.string(),
  status: z.enum(['pending', 'confirmed', 'overridden']).default('pending'),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DisasterReport = z.infer<typeof DisasterReportSchema>;

export const CreateDisasterReportSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  disaster_type: z.string(),
  category: z.enum(['natural', 'man-made']),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  location_name: z.string().optional(),
  image_url: z.string().optional(),
});

export type CreateDisasterReport = z.infer<typeof CreateDisasterReportSchema>;

export const DisasterTypes = {
  natural: [
    { id: 'earthquake', label: 'Earthquake', icon: '🌍' },
    { id: 'flood', label: 'Flood', icon: '🌊' },
    { id: 'cyclone', label: 'Cyclone', icon: '🌪️' },
    { id: 'wildfire', label: 'Wildfire', icon: '🔥' },
    { id: 'landslide', label: 'Landslide', icon: '⛰️' },
  ],
  'man-made': [
    { id: 'industrial_accident', label: 'Industrial Accident', icon: '🏭' },
    { id: 'explosion', label: 'Explosion', icon: '💥' },
    { id: 'fire', label: 'Fire', icon: '🔥' },
    { id: 'stampede', label: 'Stampede', icon: '👥' },
    { id: 'structural_collapse', label: 'Structural Collapse', icon: '🏚️' },
  ],
};

export const SeverityConfig = {
  low: { label: 'Low', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300' },
  medium: { label: 'Medium', color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-300' },
  high: { label: 'High', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300' },
};

// Hospital and Emergency Facility Schemas
export const EmergencyFacilitySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['hospital', 'emergency_center', 'rescue_camp', 'fire_station', 'police_station']),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  phone: z.string().optional(),
  capacity: z.number().optional(),
  availability: z.enum(['available', 'limited', 'full', 'closed']),
  specialties: z.array(z.string()).optional(),
  distance: z.number().optional(), // in km
  estimated_travel_time: z.string().optional(),
  is_operational: z.boolean().default(true),
  emergency_contact: z.string().optional(),
  beds_available: z.number().optional(),
  ambulances_available: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type EmergencyFacility = z.infer<typeof EmergencyFacilitySchema>;

export const FacilityTypeConfig = {
  hospital: { 
    label: 'Hospital', 
    icon: '🏥', 
    color: '#ef4444',
    markerColor: 'red',
    description: 'Medical facilities with emergency care'
  },
  emergency_center: { 
    label: 'Emergency Center', 
    icon: '🚑', 
    color: '#f59e0b',
    markerColor: 'orange',
    description: 'Dedicated emergency response centers'
  },
  rescue_camp: { 
    label: 'Rescue Camp', 
    icon: '⛺', 
    color: '#22c55e',
    markerColor: 'green',
    description: 'Temporary rescue and relief camps'
  },
  fire_station: { 
    label: 'Fire Station', 
    icon: '🚒', 
    color: '#dc2626',
    markerColor: 'darkred',
    description: 'Fire and rescue services'
  },
  police_station: { 
    label: 'Police Station', 
    icon: '🚔', 
    color: '#2563eb',
    markerColor: 'blue',
    description: 'Law enforcement and security'
  }
};

export const AvailabilityConfig = {
  available: { label: 'Available', color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/30', icon: '✅' },
  limited: { label: 'Limited', color: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: '⚠️' },
  full: { label: 'Full', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/30', icon: '🚫' },
  closed: { label: 'Closed', color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-700', icon: '❌' }
};

// SOS Emergency Request Schemas
export const SOSRequestSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string().optional(),
  location_description: z.string().optional(),
  people_count: z.number().min(1),
  medical_conditions: z.string().optional(),
  situation_description: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  image_url: z.string().optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  status: z.enum(['pending', 'acknowledged', 'responding', 'resolved']).default('pending'),
  estimated_response_time: z.string().optional(),
  assigned_responder: z.string().optional(),
  ai_assessment: z.string().optional(),
  recommended_action: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type SOSRequest = z.infer<typeof SOSRequestSchema>;

export const CreateSOSRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  location_description: z.string().optional(),
  people_count: z.number().min(1, 'Must be at least 1 person'),
  medical_conditions: z.string().optional(),
  situation_description: z.string().min(1, 'Please describe the situation'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  image_url: z.string().optional(),
});

export type CreateSOSRequest = z.infer<typeof CreateSOSRequestSchema>;

export const PriorityConfig = {
  critical: { 
    label: 'Critical', 
    color: 'text-red-700 dark:text-red-300', 
    bg: 'bg-red-100 dark:bg-red-900/30', 
    border: 'border-red-500',
    icon: '🚨',
    description: 'Life-threatening emergency'
  },
  high: { 
    label: 'High', 
    color: 'text-orange-700 dark:text-orange-300', 
    bg: 'bg-orange-100 dark:bg-orange-900/30', 
    border: 'border-orange-500',
    icon: '⚠️',
    description: 'Urgent assistance needed'
  },
  medium: { 
    label: 'Medium', 
    color: 'text-yellow-700 dark:text-yellow-300', 
    bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
    border: 'border-yellow-500',
    icon: '🔶',
    description: 'Assistance required'
  },
  low: { 
    label: 'Low', 
    color: 'text-blue-700 dark:text-blue-300', 
    bg: 'bg-blue-100 dark:bg-blue-900/30', 
    border: 'border-blue-500',
    icon: 'ℹ️',
    description: 'Non-urgent request'
  }
};

export const MedicalConditions = [
  { id: 'injury', label: 'Physical Injury', icon: '🩹' },
  { id: 'medical_emergency', label: 'Medical Emergency', icon: '💊' },
  { id: 'respiratory', label: 'Breathing Difficulty', icon: '🫁' },
  { id: 'cardiac', label: 'Heart Problems', icon: '❤️' },
  { id: 'unconscious', label: 'Unconscious Person', icon: '😵' },
  { id: 'bleeding', label: 'Severe Bleeding', icon: '🩸' },
  { id: 'fracture', label: 'Broken Bones', icon: '🦴' },
  { id: 'burn', label: 'Burns', icon: '🔥' },
  { id: 'elderly', label: 'Elderly/Disabled', icon: '👴' },
  { id: 'pregnant', label: 'Pregnant Woman', icon: '🤱' },
  { id: 'children', label: 'Children/Infants', icon: '👶' },
  { id: 'none', label: 'No Medical Issues', icon: '✅' },
];
