import { useState, useEffect } from 'react';
import { SOSRequest, CreateSOSRequest } from '@/shared/types';

// Mock data for demonstration
const mockSOSRequests: SOSRequest[] = [
  {
    id: 1,
    name: 'Raj Sharma',
    phone: '+91-98765-43210',
    location_description: 'Trapped in collapsed building, 3rd floor near Churchgate Station',
    people_count: 3,
    medical_conditions: 'One person has a broken leg, elderly woman having chest pains',
    situation_description: 'Building collapsed after earthquake. We are trapped but can hear rescuers outside.',
    latitude: 18.9322,
    longitude: 72.8264,
    priority: 'critical',
    status: 'acknowledged',
    estimated_response_time: '8 minutes',
    assigned_responder: 'Mumbai Fire Brigade Team Alpha',
    ai_assessment: 'Critical structural entrapment with medical emergencies. High-priority extraction required.',
    recommended_action: 'Deploy heavy rescue team immediately. Prepare medical triage.',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: 'Priya Patel',
    phone: '+91-87654-32109',
    location_description: 'Stuck on Eastern Express Highway, car damaged by debris',
    people_count: 2,
    medical_conditions: 'Minor cuts from broken glass',
    situation_description: 'Car hit by falling debris on Eastern Express Highway. Vehicle damaged but we can move.',
    latitude: 19.1136,
    longitude: 72.8697,
    priority: 'high',
    status: 'responding',
    estimated_response_time: '12 minutes',
    assigned_responder: 'Highway Patrol Unit 5',
    ai_assessment: 'Vehicle entrapment on critical infrastructure. Moderate injury assessment.',
    recommended_action: 'Send mobile rescue unit and medical support.',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    name: 'Arjun Singh',
    phone: '+91-76543-21098',
    location_description: 'Community center basement in Bandra East, flooded',
    people_count: 12,
    medical_conditions: 'Two children having asthma attacks, one elderly man with diabetes',
    situation_description: 'Monsoon flood trapped us in community center basement. Water rising slowly.',
    latitude: 19.0596,
    longitude: 72.8295,
    priority: 'high',
    status: 'pending',
    ai_assessment: 'Multiple persons trapped by flood with medical complications. Time-sensitive evacuation needed.',
    recommended_action: 'Deploy water rescue team and medical support immediately.',
    created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    name: 'Meera Reddy',
    phone: '+91-65432-10987',
    location_description: 'Apartment building lobby in Powai, power out',
    people_count: 1,
    medical_conditions: 'None reported',
    situation_description: 'Elevator stuck, stairs blocked by debris. Need assistance getting out.',
    latitude: 19.1176,
    longitude: 72.9060,
    priority: 'medium',
    status: 'pending',
    ai_assessment: 'Single person trapped, no immediate medical concerns. Standard extraction.',
    recommended_action: 'Send basic rescue unit when available.',
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    name: 'Anonymous',
    location_description: 'Near Marine Drive, tourist area',
    people_count: 1,
    medical_conditions: 'Anxiety attack, hyperventilating',
    situation_description: 'Panic attack during disaster. Need someone to check on me.',
    latitude: 18.9439,
    longitude: 72.8233,
    priority: 'low',
    status: 'pending',
    ai_assessment: 'Psychological distress, no physical entrapment. Medical assessment recommended.',
    recommended_action: 'Send medical support or mental health first aid when resources available.',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

// AI-powered priority assessment function
const assessPriority = (request: CreateSOSRequest): 'critical' | 'high' | 'medium' | 'low' => {
  const medicalKeywords = ['bleeding', 'unconscious', 'heart', 'breathing', 'chest pain', 'broken', 'fracture', 'burn'];
  const criticalKeywords = ['trapped', 'collapsed', 'can\'t move', 'buried', 'unconscious', 'severe'];
  const urgentKeywords = ['injured', 'stuck', 'flooding', 'fire', 'smoke', 'debris'];

  const situation = (request.situation_description + ' ' + (request.medical_conditions || '')).toLowerCase();
  
  // Critical priority
  if (request.people_count >= 5 || 
      criticalKeywords.some(keyword => situation.includes(keyword)) ||
      medicalKeywords.some(keyword => situation.includes(keyword))) {
    return 'critical';
  }
  
  // High priority  
  if (request.people_count >= 3 ||
      urgentKeywords.some(keyword => situation.includes(keyword))) {
    return 'high';
  }
  
  // Medium priority
  if (request.people_count >= 2 || request.medical_conditions) {
    return 'medium';
  }
  
  // Low priority
  return 'low';
};

// Generate AI assessment and recommendations
const generateAIAssessment = (request: CreateSOSRequest, priority: string): { assessment: string; recommendation: string } => {
  const peopleText = request.people_count === 1 ? 'Single person' : `${request.people_count} people`;
  const medicalText = request.medical_conditions ? `Medical concerns: ${request.medical_conditions}` : 'No medical issues reported';
  
  let assessment = '';
  let recommendation = '';
  
  switch (priority) {
    case 'critical':
      assessment = `${peopleText} in critical situation. ${medicalText}. Immediate intervention required.`;
      recommendation = 'URGENT: Deploy emergency response team immediately. Prepare medical triage and specialized equipment.';
      break;
    case 'high':
      assessment = `${peopleText} requiring urgent assistance. ${medicalText}. Time-sensitive response needed.`;
      recommendation = 'HIGH PRIORITY: Send rescue team and medical support within 15 minutes.';
      break;
    case 'medium':
      assessment = `${peopleText} need assistance. ${medicalText}. Standard response protocols.`;
      recommendation = 'MEDIUM PRIORITY: Deploy available units when resources permit. ETA 30-45 minutes.';
      break;
    case 'low':
      assessment = `${peopleText} requesting support. ${medicalText}. Non-critical situation.`;
      recommendation = 'LOW PRIORITY: Assign when other emergencies are resolved. Consider remote assistance first.';
      break;
  }
  
  return { assessment, recommendation };
};

export function useSOSRequests() {
  const [sosRequests, setSOSRequests] = useState<SOSRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with offline queue support
    setTimeout(() => {
      setSOSRequests(mockSOSRequests);
      setLoading(false);
    }, 300);
  }, []);

  const submitSOSRequest = (newRequest: CreateSOSRequest): SOSRequest => {
    const priority = assessPriority(newRequest);
    const { assessment, recommendation } = generateAIAssessment(newRequest, priority);
    
    const sosRequest: SOSRequest = {
      ...newRequest,
      id: Date.now(),
      priority,
      status: 'pending',
      ai_assessment: assessment,
      recommended_action: recommendation,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setSOSRequests(prev => [sosRequest, ...prev]);
    
    // Simulate offline queue - in real app this would handle network failures
    if (Math.random() > 0.1) { // 90% success rate
      console.log('SOS request submitted successfully');
    } else {
      console.log('SOS request queued for when connectivity returns');
    }
    
    return sosRequest;
  };

  const updateSOSStatus = (id: number, status: SOSRequest['status'], assignedResponder?: string, eta?: string) => {
    setSOSRequests(prev => prev.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status, 
            assigned_responder: assignedResponder || request.assigned_responder,
            estimated_response_time: eta || request.estimated_response_time,
            updated_at: new Date().toISOString() 
          }
        : request
    ));
  };

  const acknowledgeRequest = (id: number, responderName: string, eta: string) => {
    updateSOSStatus(id, 'acknowledged', responderName, eta);
  };

  const markAsResponding = (id: number) => {
    updateSOSStatus(id, 'responding');
  };

  const resolveRequest = (id: number) => {
    updateSOSStatus(id, 'resolved');
  };

  // Get location from browser geolocation API
  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          resolve(null);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  };

  return {
    sosRequests,
    loading,
    submitSOSRequest,
    updateSOSStatus,
    acknowledgeRequest,
    markAsResponding,
    resolveRequest,
    getCurrentLocation,
  };
}
