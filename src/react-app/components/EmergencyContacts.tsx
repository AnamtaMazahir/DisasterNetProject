import { Phone, Heart, Shield, Flame, Users, AlertTriangle } from 'lucide-react';
import EnhancedButton from './EnhancedButton';
import EnhancedCard from './EnhancedCard';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  description: string;
}

const IndianEmergencyNumbers: EmergencyContact[] = [
  {
    id: 'disaster',
    name: 'Disaster Management',
    number: '1070',
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    gradient: 'from-red-500 to-red-600',
    description: 'National Disaster Management Authority helpline'
  },
  {
    id: 'ambulance',
    name: 'Ambulance / Medical',
    number: '108',
    icon: Heart,
    color: 'text-green-600 dark:text-green-400',
    gradient: 'from-green-500 to-green-600',
    description: 'Emergency medical services and ambulance'
  },
  {
    id: 'fire',
    name: 'Fire Services',
    number: '101',
    icon: Flame,
    color: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-500 to-orange-600',
    description: 'Fire emergency and rescue services'
  },
  {
    id: 'police',
    name: 'Police',
    number: '100',
    icon: Shield,
    color: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Police emergency and law enforcement'
  },
  {
    id: 'women',
    name: 'Women Helpline',
    number: '1091',
    icon: Users,
    color: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Women in distress helpline'
  },
  {
    id: 'women_alt',
    name: 'Women Helpline Alt',
    number: '181',
    icon: Users,
    color: 'text-pink-600 dark:text-pink-400',
    gradient: 'from-pink-500 to-pink-600',
    description: 'Alternative women helpline number'
  }
];

interface EmergencyContactsProps {
  variant?: 'full' | 'compact' | 'quick';
  showHeader?: boolean;
  className?: string;
}

export default function EmergencyContacts({ 
  variant = 'full', 
  showHeader = true,
  className = '' 
}: EmergencyContactsProps) {
  const handleCall = (number: string, name: string) => {
    if (window.confirm(`Call ${name} at ${number}?`)) {
      window.open(`tel:${number}`);
    }
  };

  if (variant === 'quick') {
    return (
      <div className={`space-y-2 ${className}`}>
        {showHeader && (
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergency Numbers (India)
          </h3>
        )}
        <div className="grid grid-cols-2 gap-2">
          {IndianEmergencyNumbers.slice(0, 4).map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleCall(contact.number, contact.name)}
              className={`
                flex items-center gap-2 p-2 rounded-lg border
                text-left transition-all duration-200
                bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            >
              <div className={`w-6 h-6 bg-gradient-to-r ${contact.gradient} rounded-full flex items-center justify-center`}>
                <contact.icon className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">{contact.number}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{contact.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <EnhancedCard variant="glass" className={`p-4 ${className}`}>
        {showHeader && (
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-500" />
            Emergency Contacts (India)
          </h3>
        )}
        <div className="space-y-2">
          {IndianEmergencyNumbers.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${contact.gradient} rounded-lg flex items-center justify-center`}>
                  <contact.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{contact.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleCall(contact.number, contact.name)}
                className={`
                  px-3 py-1.5 bg-gradient-to-r ${contact.gradient} text-white
                  rounded-lg font-bold text-sm transition-all duration-200
                  hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                `}
              >
                {contact.number}
              </button>
            </div>
          ))}
        </div>
      </EnhancedCard>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            Emergency Contacts
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Quick access to Indian emergency services
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {IndianEmergencyNumbers.map((contact) => (
          <EnhancedCard key={contact.id} variant="glass" className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${contact.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <contact.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contact.description}
                  </p>
                </div>
              </div>
              
              <EnhancedButton
                onClick={() => handleCall(contact.number, contact.name)}
                variant="gradient"
                size="lg"
                icon={Phone}
                className={`bg-gradient-to-r ${contact.gradient} text-white min-w-32`}
              >
                {contact.number}
              </EnhancedButton>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {/* Important Notice */}
      <EnhancedCard variant="glass" className="p-4 border-l-4 border-yellow-500">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Important Information</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              These are the official emergency numbers for India. Always call the appropriate service 
              for your specific emergency. In case of network issues, try calling from a different 
              location or use a landline if available.
            </p>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );
}

export { IndianEmergencyNumbers };
