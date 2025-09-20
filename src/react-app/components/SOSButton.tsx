import { useState } from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router';

interface SOSButtonProps {
  className?: string;
  variant?: 'floating' | 'inline';
}

export default function SOSButton({ className = '', variant = 'floating' }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const navigate = useNavigate();

  const handleSOSClick = () => {
    setIsPressed(true);
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    
    setTimeout(() => {
      setIsPressed(false);
      navigate('/sos/request');
    }, 300);
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleSOSClick}
        className={`
          fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-50
          w-16 h-16 lg:w-20 lg:h-20
          bg-gradient-to-br from-red-500 via-red-600 to-red-700 
          text-white rounded-full shadow-2xl
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:shadow-red-500/50 hover:shadow-2xl hover:scale-110
          active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-500/50
          animate-pulse-glow
          ${isPressed ? 'scale-95 shadow-red-500/70' : ''}
          ${className}
        `}
        aria-label="Emergency SOS"
      >
        <div className="relative">
          <AlertTriangle className="w-8 h-8 lg:w-10 lg:h-10" />
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
        </div>
        
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75" />
        <div className="absolute inset-0 rounded-full border-2 border-white/30" />
        
        {/* Emergency label */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap shadow-lg">
          SOS
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleSOSClick}
      className={`
        inline-flex items-center gap-3 px-6 py-4
        bg-gradient-to-r from-red-500 to-red-600 text-white
        rounded-2xl shadow-xl font-bold text-lg
        transition-all duration-300 ease-out
        hover:shadow-2xl hover:shadow-red-500/30 hover:scale-105
        active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-500/50
        ${isPressed ? 'scale-95' : ''}
        ${className}
      `}
    >
      <div className="relative">
        <Phone className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      </div>
      <div>
        <div className="text-xl font-black">SOS EMERGENCY</div>
        <div className="text-sm font-medium opacity-90">Tap for immediate help</div>
      </div>
    </button>
  );
}
