import { useState, useEffect } from 'react';
import { DisasterReport } from '@/shared/types';

// Mock data for demonstration
const mockReports: DisasterReport[] = [
  {
    id: 1,
    title: 'Earthquake Damage Assessment',
    description: 'Building structural damage observed in Bandra-Kurla Complex',
    disaster_type: 'earthquake',
    category: 'natural',
    severity: 'high',
    confidence: 0.94,
    latitude: 19.0625,
    longitude: 72.8643,
    location_name: 'Mumbai, Maharashtra',
    image_url: 'https://images.unsplash.com/photo-1578661047720-1d99a8b0d6eb?w=800&auto=format&fit=crop&q=60',
    recommendation: 'Immediate evacuation required. Deploy emergency response teams.',
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: 'Monsoon Flood Impact Survey',
    description: 'Severe waterlogging in residential areas of Whitefield',
    disaster_type: 'flood',
    category: 'natural',
    severity: 'medium',
    confidence: 0.78,
    latitude: 12.9698,
    longitude: 77.7500,
    location_name: 'Bangalore, Karnataka',
    image_url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60',
    recommendation: 'Monitor water levels. Prepare evacuation routes.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: 'Industrial Fire Assessment',
    description: 'Chemical plant fire with smoke plume in Andheri MIDC',
    disaster_type: 'fire',
    category: 'man-made',
    severity: 'high',
    confidence: 0.91,
    latitude: 19.1176,
    longitude: 72.8469,
    location_name: 'Mumbai, Maharashtra',
    image_url: 'https://images.unsplash.com/photo-1574870111867-089ad3a5de6d?w=800&auto=format&fit=crop&q=60',
    recommendation: 'Chemical hazard detected. Establish wide perimeter.',
    status: 'pending',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    title: 'Forest Fire Assessment',
    description: 'Wildfire spreading near Nilgiri Hills residential area',
    disaster_type: 'wildfire',
    category: 'natural',
    severity: 'low',
    confidence: 0.65,
    latitude: 11.4064,
    longitude: 76.6932,
    location_name: 'Ooty, Tamil Nadu',
    image_url: 'https://images.unsplash.com/photo-1628890923662-2cb23c2e0742?w=800&auto=format&fit=crop&q=60',
    recommendation: 'Continue monitoring. Pre-position resources.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

export function useReports() {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 500);
  }, []);

  const addReport = (newReport: Omit<DisasterReport, 'id' | 'created_at' | 'updated_at'>) => {
    const report: DisasterReport = {
      ...newReport,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setReports(prev => [report, ...prev]);
    return report;
  };

  const updateReportStatus = (id: number, status: DisasterReport['status']) => {
    setReports(prev => prev.map(report => 
      report.id === id 
        ? { ...report, status, updated_at: new Date().toISOString() }
        : report
    ));
  };

  return {
    reports,
    loading,
    addReport,
    updateReportStatus,
  };
}
