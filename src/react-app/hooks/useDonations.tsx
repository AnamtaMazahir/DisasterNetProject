import { useState, useEffect } from 'react';

interface Donation {
  id: number;
  amount: number;
  donor: string;
  isAnonymous: boolean;
  paymentMethod: string;
  created_at: string;
}

interface DonationStats {
  totalRaised: number;
  totalDonors: number;
  targetAmount: number;
  recentDonations: Array<{
    amount: number;
    donor: string;
    timeAgo: string;
  }>;
  topDonors: Array<{
    donor: string;
    amount: number;
    isAnonymous: boolean;
  }>;
  monthlyProgress: Array<{
    month: string;
    amount: number;
  }>;
}

// Mock data for demonstration
const mockDonations: Donation[] = [
  {
    id: 1,
    amount: 5000,
    donor: 'Rajesh Kumar',
    isAnonymous: false,
    paymentMethod: 'upi',
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    amount: 10000,
    donor: 'Anonymous',
    isAnonymous: true,
    paymentMethod: 'card',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    amount: 2500,
    donor: 'Priya Singh',
    isAnonymous: false,
    paymentMethod: 'upi',
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    amount: 1000,
    donor: 'Amit Sharma',
    isAnonymous: false,
    paymentMethod: 'netbanking',
    created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    amount: 7500,
    donor: 'Anonymous',
    isAnonymous: true,
    paymentMethod: 'card',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    amount: 3000,
    donor: 'Sneha Patel',
    isAnonymous: false,
    paymentMethod: 'upi',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    amount: 15000,
    donor: 'Vikram Industries',
    isAnonymous: false,
    paymentMethod: 'netbanking',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    amount: 500,
    donor: 'Meera Reddy',
    isAnonymous: false,
    paymentMethod: 'upi',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  // Add more mock donations to reach the target
  ...Array.from({ length: 339 }, (_, i) => ({
    id: 9 + i,
    amount: Math.floor(Math.random() * 5000) + 100,
    donor: Math.random() > 0.3 ? `Donor ${i + 1}` : 'Anonymous',
    isAnonymous: Math.random() > 0.3 ? false : true,
    paymentMethod: ['upi', 'card', 'netbanking'][Math.floor(Math.random() * 3)],
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  })),
];

const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const donationTime = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - donationTime.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hr ago`;
  return `${Math.floor(diffInMinutes / 1440)} days ago`;
};

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDonations(mockDonations);
      setLoading(false);
    }, 500);
  }, []);

  const addDonation = (newDonation: Omit<Donation, 'id' | 'created_at'>): Donation => {
    const donation: Donation = {
      ...newDonation,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setDonations(prev => [donation, ...prev]);
    return donation;
  };

  const getDonationStats = (): DonationStats => {
    const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const totalDonors = donations.length;
    const targetAmount = 2500000; // ₹25 lakh target

    // Get recent donations (last 10)
    const recentDonations = donations
      .slice(0, 10)
      .map(donation => ({
        amount: donation.amount,
        donor: donation.isAnonymous ? 'Anonymous' : donation.donor,
        timeAgo: getTimeAgo(donation.created_at),
      }));

    // Get top donors (aggregated by donor name, excluding anonymous)
    const donorTotals: { [key: string]: number } = {};
    donations
      .filter(d => !d.isAnonymous)
      .forEach(donation => {
        donorTotals[donation.donor] = (donorTotals[donation.donor] || 0) + donation.amount;
      });

    const topDonors = Object.entries(donorTotals)
      .map(([donor, amount]) => ({ donor, amount, isAnonymous: false }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Monthly progress (last 6 months)
    const now = new Date();
    const monthlyProgress = Array.from({ length: 6 }, (_, i) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      const monthlyAmount = donations
        .filter(d => {
          const donationDate = new Date(d.created_at);
          return donationDate >= monthStart && donationDate <= monthEnd;
        })
        .reduce((sum, d) => sum + d.amount, 0);

      return {
        month: monthDate.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        amount: monthlyAmount,
      };
    }).reverse();

    return {
      totalRaised,
      totalDonors,
      targetAmount,
      recentDonations,
      topDonors,
      monthlyProgress,
    };
  };

  const getImpactMetrics = (amount: number) => {
    return {
      hygieneKits: Math.floor(amount / 100),
      foodSupplies: Math.floor(amount / 500),
      waterSupply: Math.floor(amount / 1000),
      medicalKits: Math.floor(amount / 5000),
      shelterMaterials: Math.floor(amount / 10000),
    };
  };

  return {
    donations,
    loading,
    addDonation,
    getDonationStats,
    getImpactMetrics,
  };
}
