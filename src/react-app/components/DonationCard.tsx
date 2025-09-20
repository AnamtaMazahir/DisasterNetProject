import { Heart, Users, TrendingUp, IndianRupee, Gift } from 'lucide-react';
import EnhancedCard from './EnhancedCard';
import EnhancedButton from './EnhancedButton';
import { Link } from 'react-router';

interface DonationStats {
  totalRaised: number;
  totalDonors: number;
  targetAmount: number;
  recentDonations: Array<{
    amount: number;
    donor: string;
    timeAgo: string;
  }>;
}

interface DonationCardProps {
  variant?: 'compact' | 'full';
  stats: DonationStats;
  className?: string;
}

export default function DonationCard({ 
  variant = 'full', 
  stats,
  className = '' 
}: DonationCardProps) {
  const progressPercentage = Math.min((stats.totalRaised / stats.targetAmount) * 100, 100);

  if (variant === 'compact') {
    return (
      <EnhancedCard variant="gradient" gradient="green" className={`p-4 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Relief Fund</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Community Support</p>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-700 dark:text-gray-300">Progress</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              {stats.totalRaised.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              from {stats.totalDonors} donors
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Goal</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <IndianRupee className="w-3 h-3" />
              {stats.targetAmount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <Link to="/donation">
          <EnhancedButton variant="primary" size="sm" icon={Heart} fullWidth>
            Donate Now
          </EnhancedButton>
        </Link>
      </EnhancedCard>
    );
  }

  return (
    <EnhancedCard variant="glass" className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Disaster Relief Fund
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Supporting victims and recovery efforts
            </p>
          </div>
        </div>
        <Link to="/donation">
          <EnhancedButton variant="gradient" size="lg" icon={Gift}>
            Donate Now
          </EnhancedButton>
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Fundraising Progress
          </span>
          <span className="font-bold text-green-600 dark:text-green-400">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-700 shadow-sm relative overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-center text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
            <IndianRupee className="w-5 h-5 mr-1" />
            {stats.totalRaised.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">Total Raised</p>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-center text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
            <Users className="w-5 h-5 mr-1" />
            {stats.totalDonors}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Generous Donors</p>
        </div>
      </div>

      {/* Recent Donations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            Recent Contributions
          </h4>
        </div>
        <div className="space-y-2">
          {stats.recentDonations.slice(0, 3).map((donation, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white fill-current" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {donation.donor}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" />
                  {donation.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {donation.timeAgo}
                </p>
              </div>
            </div>
          ))}
        </div>
        {stats.recentDonations.length === 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            Be the first to contribute to this relief fund
          </div>
        )}
      </div>
    </EnhancedCard>
  );
}
