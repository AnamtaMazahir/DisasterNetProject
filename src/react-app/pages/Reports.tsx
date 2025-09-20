import { useState } from 'react';
import { useReports } from '@/react-app/hooks/useReports';
import SOSButton from '@/react-app/components/SOSButton';
import ReportsList from '@/react-app/components/ReportsList';
import { Download, FileText, Filter } from 'lucide-react';

export default function Reports() {
  const { reports, loading, updateReportStatus } = useReports();
  const [selectedCategory, setSelectedCategory] = useState<'natural' | 'man-made' | 'all'>('all');

  const handleReportAction = (action: string, reportId: number) => {
    console.log(`Action: ${action} on report ${reportId}`);
    
    if (action === 'mark_safe') {
      updateReportStatus(reportId, 'confirmed');
    } else if (action === 'override') {
      updateReportStatus(reportId, 'overridden');
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    const filteredReports = reports.filter(report => 
      selectedCategory === 'all' || report.category === selectedCategory
    );

    if (format === 'csv') {
      const csvContent = [
        ['ID', 'Title', 'Type', 'Category', 'Severity', 'Confidence', 'Location', 'Status', 'Created'].join(','),
        ...filteredReports.map(report => [
          report.id,
          `"${report.title}"`,
          report.disaster_type,
          report.category,
          report.severity,
          report.confidence,
          `"${report.location_name || ''}"`,
          report.status,
          new Date(report.created_at).toLocaleDateString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `disaster-reports-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Mock PDF generation
      alert('PDF export would be generated here. This is a demo implementation.');
    }
  };

  const filteredReports = reports.filter(report => 
    selectedCategory === 'all' || report.category === selectedCategory
  );

  const stats = {
    total: filteredReports.length,
    high: filteredReports.filter(r => r.severity === 'high').length,
    medium: filteredReports.filter(r => r.severity === 'medium').length,
    low: filteredReports.filter(r => r.severity === 'low').length,
    pending: filteredReports.filter(r => r.status === 'pending').length,
    confirmed: filteredReports.filter(r => r.status === 'confirmed').length,
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Disaster Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and review all disaster assessment reports
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.high}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">High</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.medium}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Medium</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.low}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Low</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.confirmed}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All Reports' },
            { key: 'natural', label: 'Natural Disasters' },
            { key: 'man-made', label: 'Man-Made Disasters' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as any)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <ReportsList
        reports={reports}
        selectedCategory={selectedCategory}
        onAction={handleReportAction}
      />
      
      {/* Floating SOS Button */}
      <SOSButton />
    </div>
  );
}
