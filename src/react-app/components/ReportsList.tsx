import { useState } from 'react';
import { DisasterReport } from '@/shared/types';
import ReportCard from './ReportCard';
import { Filter, SortAsc, SortDesc } from 'lucide-react';

interface ReportsListProps {
  reports: DisasterReport[];
  selectedCategory?: 'natural' | 'man-made' | 'all';
  onAction?: (action: string, reportId: number) => void;
}

type SortField = 'created_at' | 'severity' | 'confidence';
type SortDirection = 'asc' | 'desc';

export default function ReportsList({ 
  reports, 
  selectedCategory = 'all',
  onAction 
}: ReportsListProps) {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filteredAndSortedReports = reports
    .filter(report => 
      (selectedCategory === 'all' || report.category === selectedCategory) &&
      (severityFilter === 'all' || report.severity === severityFilter)
    )
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === 'severity') {
        const severityOrder = { low: 1, medium: 2, high: 3 };
        aValue = severityOrder[a.severity];
        bValue = severityOrder[b.severity];
      }
      
      const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? result : -result;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Sorting */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            {(['created_at', 'severity', 'confidence'] as const).map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`
                  flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors
                  ${sortField === field 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {field === 'created_at' ? 'Date' : field.charAt(0).toUpperCase() + field.slice(1)}
                {sortField === field && (
                  sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredAndSortedReports.length} of {reports.length} reports
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6">
        {filteredAndSortedReports.length > 0 ? (
          filteredAndSortedReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onAction={onAction}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-2">
              <Filter className="w-12 h-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No reports found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or check back later for new reports.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
