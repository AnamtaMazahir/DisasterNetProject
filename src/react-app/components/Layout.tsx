import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { useTheme } from '@/react-app/hooks/useTheme';
import EnhancedButton from '@/react-app/components/EnhancedButton';
import { 
  Home, 
  Upload, 
  Map, 
  List, 
  Moon, 
  Sun,
  Shield,
  Zap,
  Users,
  Navigation,
  AlertCircle,
  Phone,
  Heart
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Map View', href: '/map', icon: Map },
    { name: 'Reports', href: '/reports', icon: List },
    { name: 'SOS Center', href: '/sos', icon: AlertCircle },
    { name: 'Emergency', href: '/emergency-contacts', icon: Phone },
    { name: 'Donation', href: '/donation', icon: Heart },
    { name: 'Rescue Planning', href: '/rescue-planning', icon: Users },
    { name: 'Evacuation', href: '/evacuation', icon: Navigation },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 transition-all duration-500">
      {/* Animated background patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="glass border-b border-white/20 dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 animate-pulse-glow">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  DisasterNet
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">AI-Powered Response</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass rounded-full">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live</span>
              </div>
              
              <EnhancedButton
                onClick={toggleTheme}
                variant="ghost"
                size="sm"
                icon={theme === 'light' ? Moon : Sun}
                className="rounded-full w-10 h-10 p-0"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 glass border-r border-white/20 dark:border-white/10">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative
                      ${active
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:scale-105'
                      }
                    `}
                  >
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30" />
                    )}
                    <Icon className={`w-5 h-5 relative z-10 ${active ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-500'}`} />
                    <span className="relative z-10">{item.name}</span>
                    {active && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse relative z-10" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main content */}
        <div className="flex-1 lg:pl-64">
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Bottom navigation - Shown on mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/20 dark:border-white/10 px-4 py-2 backdrop-blur-xl">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 relative group
                  ${active
                    ? 'text-blue-600 dark:text-blue-400 scale-110'
                    : 'text-gray-600 dark:text-gray-400 hover:scale-105'
                  }
                `}
              >
                {active && (
                  <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-xl" />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${active ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-blue-500'}`} />
                <span className="text-xs font-medium relative z-10">{item.name}</span>
                {active && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
