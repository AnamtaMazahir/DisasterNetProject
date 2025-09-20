import { useState } from 'react';
import { useNavigate } from 'react-router';
import EnhancedCard from '@/react-app/components/EnhancedCard';
import EnhancedButton from '@/react-app/components/EnhancedButton';
import DonationCard from '@/react-app/components/DonationCard';
import { 
  Heart, 
  IndianRupee, 
  CreditCard, 
  Smartphone,
  Building,
  Shield,
  Target,
  ArrowLeft,
  CheckCircle,
  Gift
} from 'lucide-react';

const donationStats = {
  totalRaised: 1245700,
  totalDonors: 347,
  targetAmount: 2500000,
  recentDonations: [
    { amount: 2500, donor: 'Rajesh Kumar', timeAgo: '2 min ago' },
    { amount: 1000, donor: 'Priya Singh', timeAgo: '5 min ago' },
    { amount: 5000, donor: 'Anonymous', timeAgo: '12 min ago' },
    { amount: 500, donor: 'Amit Sharma', timeAgo: '18 min ago' },
    { amount: 3000, donor: 'Sneha Patel', timeAgo: '25 min ago' },
  ],
};

const quickAmounts = [100, 500, 1000, 2500, 5000, 10000];

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay with UPI apps' },
  { id: 'card', name: 'Card', icon: CreditCard, description: 'Credit/Debit Card' },
  { id: 'netbanking', name: 'Net Banking', icon: Building, description: 'Online Banking' },
];

export default function Donation() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'amount' | 'payment' | 'processing' | 'success'>('amount');
  const [amount, setAmount] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('upi');
  const [donorName, setDonorName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string>('Processing your donation...');

  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handleCustomAmount = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const isValidAmount = () => {
    const numAmount = parseInt(amount);
    return numAmount >= 1;
  };

  const proceedToPayment = () => {
    if (isValidAmount()) {
      setStep('payment');
    }
  };

  const processDonation = () => {
    setStep('processing');
    
    // Simulate payment processing
    const messages = [
      'Connecting to payment gateway...',
      'Validating payment details...',
      'Processing transaction...',
      'Confirming donation...',
      'Success! Thank you for your contribution.'
    ];

    messages.forEach((message, index) => {
      setTimeout(() => {
        setProcessingMessage(message);
        if (index === messages.length - 1) {
          setTimeout(() => setStep('success'), 1000);
        }
      }, (index + 1) * 1500);
    });
  };

  const donationAmount = parseInt(amount) || 0;

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <EnhancedCard variant="gradient" gradient="green" className="p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You! 🙏
          </h1>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Your generous donation of{' '}
            <span className="font-bold text-green-600 dark:text-green-400 inline-flex items-center">
              <IndianRupee className="w-5 h-5" />
              {donationAmount.toLocaleString('en-IN')}
            </span>{' '}
            will make a real difference
          </p>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Your Impact
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {donationAmount >= 5000 && (
                <p>• Can provide emergency medical kit for 5 families</p>
              )}
              {donationAmount >= 2000 && (
                <p>• Can supply clean drinking water for 10 people for a week</p>
              )}
              {donationAmount >= 1000 && (
                <p>• Can provide basic food supplies for 2 families for 3 days</p>
              )}
              {donationAmount >= 500 && (
                <p>• Can supply emergency blankets for 3 people</p>
              )}
              {donationAmount >= 100 && (
                <p>• Can provide essential hygiene kit for one person</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <EnhancedButton
              variant="primary"
              size="lg"
              icon={Gift}
              onClick={() => {
                setStep('amount');
                setAmount('');
                setDonorName('');
              }}
            >
              Donate Again
            </EnhancedButton>
            <EnhancedButton
              variant="secondary"
              size="lg"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </EnhancedButton>
          </div>
        </EnhancedCard>

        {/* Updated Stats Card */}
        <DonationCard 
          variant="compact" 
          stats={{
            ...donationStats,
            totalRaised: donationStats.totalRaised + donationAmount,
            totalDonors: donationStats.totalDonors + 1,
            recentDonations: [
              { 
                amount: donationAmount, 
                donor: isAnonymous ? 'Anonymous' : donorName || 'Anonymous', 
                timeAgo: 'Just now' 
              },
              ...donationStats.recentDonations.slice(0, 4)
            ]
          }}
        />
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="max-w-2xl mx-auto">
        <EnhancedCard variant="glass" className="p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Processing Your Donation
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {processingMessage}
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Your payment is processed through encrypted channels
            </p>
          </div>
        </EnhancedCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <EnhancedButton
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => step === 'payment' ? setStep('amount') : navigate('/')}
        >
          Back
        </EnhancedButton>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Support Disaster Relief
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Every contribution makes a difference in someone's life
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {step === 'amount' && (
            <EnhancedCard variant="glass" className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Choose Donation Amount
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Every rupee helps disaster victims rebuild their lives
                  </p>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Select
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => handleAmountSelect(quickAmount)}
                      className={`
                        p-3 rounded-xl border-2 transition-all font-semibold flex items-center justify-center gap-1
                        ${amount === quickAmount.toString()
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-900/10 text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      <IndianRupee className="w-4 h-4" />
                      {quickAmount.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Or Enter Custom Amount
                </h3>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    placeholder="Enter amount (minimum ₹1)"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold text-gray-900 dark:text-white"
                  />
                </div>
                {amount && parseInt(amount) < 1 && (
                  <p className="text-red-500 text-sm mt-1">
                    Minimum donation amount is ₹1
                  </p>
                )}
              </div>

              {/* Donor Information */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Donor Information (Optional)
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Your name"
                    disabled={isAnonymous}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => {
                        setIsAnonymous(e.target.checked);
                        if (e.target.checked) setDonorName('');
                      }}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Donate anonymously
                    </span>
                  </label>
                </div>
              </div>

              <EnhancedButton
                onClick={proceedToPayment}
                disabled={!isValidAmount()}
                variant="gradient"
                size="lg"
                icon={Heart}
                fullWidth
              >
                {amount ? `Donate ₹${parseInt(amount).toLocaleString('en-IN')}` : 'Continue to Payment'}
              </EnhancedButton>
            </EnhancedCard>
          )}

          {step === 'payment' && (
            <EnhancedCard variant="glass" className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Payment Method
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose your preferred payment option
                  </p>
                </div>
              </div>

              {/* Donation Summary */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 mb-6">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Donation Summary
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 dark:text-green-300">Amount:</span>
                  <span className="font-bold text-green-800 dark:text-green-200 text-lg flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {donationAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                {(donorName || isAnonymous) && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-green-700 dark:text-green-300">Donor:</span>
                    <span className="text-green-800 dark:text-green-200">
                      {isAnonymous ? 'Anonymous' : donorName}
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`
                        w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4
                        ${selectedPayment === method.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${selectedPayment === method.id
                          ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {method.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {method.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <EnhancedButton
                  onClick={() => setStep('amount')}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  Back
                </EnhancedButton>
                <EnhancedButton
                  onClick={processDonation}
                  variant="gradient"
                  size="lg"
                  icon={Heart}
                  className="flex-1"
                >
                  Complete Donation
                </EnhancedButton>
              </div>
            </EnhancedCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <DonationCard variant="compact" stats={donationStats} />

          {/* Impact Information */}
          <EnhancedCard variant="gradient" gradient="purple" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-gray-900 dark:text-white">Your Impact</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>₹100 = Emergency hygiene kit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>₹500 = Food supplies for 2 days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>₹1,000 = Clean water for 1 week</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>₹5,000 = Emergency medical kit</span>
              </div>
            </div>
          </EnhancedCard>

          {/* Trust & Security */}
          <EnhancedCard variant="glass" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900 dark:text-white">Trust & Security</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Encrypted payment processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>100% goes to disaster relief</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Transparent fund allocation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Real-time impact tracking</span>
              </div>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </div>
  );
}
