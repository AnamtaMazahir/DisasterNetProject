import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSOSRequests } from '@/react-app/hooks/useSOSRequests';
import EnhancedCard from '@/react-app/components/EnhancedCard';
import EnhancedButton from '@/react-app/components/EnhancedButton';
import EmergencyContacts from '@/react-app/components/EmergencyContacts';
import { MedicalConditions } from '@/shared/types';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  Send, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  Heart,
  Navigation
} from 'lucide-react';

export default function SOSRequest() {
  const navigate = useNavigate();
  const { submitSOSRequest, getCurrentLocation } = useSOSRequests();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location_description: '',
    people_count: 1,
    medical_conditions: '',
    situation_description: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    image_url: '',
  });
  
  const [selectedMedicalConditions, setSelectedMedicalConditions] = useState<string[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [step, setStep] = useState(1);
  const maxSteps = 4;

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      if (location) {
        setFormData(prev => ({
          ...prev,
          latitude: location.latitude,
          longitude: location.longitude
        }));
        setHasLocation(true);
      } else {
        alert('Unable to get your location. Please describe your location in detail.');
      }
    } catch (error) {
      console.error('Location error:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleMedicalConditionToggle = (conditionId: string) => {
    setSelectedMedicalConditions(prev => {
      if (conditionId === 'none') {
        return ['none'];
      }
      
      const filtered = prev.filter(id => id !== 'none');
      if (prev.includes(conditionId)) {
        return filtered.filter(id => id !== conditionId);
      } else {
        return [...filtered, conditionId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.situation_description.trim()) {
      alert('Please fill in your name and describe the situation');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const medicalConditionsText = selectedMedicalConditions.length > 0 
        ? selectedMedicalConditions
            .map(id => MedicalConditions.find(c => c.id === id)?.label)
            .filter(Boolean)
            .join(', ')
        : '';

      const sosRequest = submitSOSRequest({
        ...formData,
        medical_conditions: medicalConditionsText || undefined,
      });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success and redirect
      navigate('/sos/submitted', { 
        state: { 
          requestId: sosRequest.id,
          priority: sosRequest.priority 
        } 
      });
    } catch (error) {
      console.error('Error submitting SOS:', error);
      alert('Error submitting request. It has been queued for when connectivity returns.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < maxSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.name.trim() && formData.situation_description.trim();
      case 2: return formData.people_count >= 1;
      case 3: return true; // Medical conditions are optional
      case 4: return true; // Location is optional but recommended
      default: return false;
    }
  };

  useEffect(() => {
    // Auto-get location when component mounts
    handleGetLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20 py-4 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse-glow">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
            Emergency SOS Request
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Help is on the way. Fill out this form quickly and accurately.
          </p>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: maxSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index + 1 <= step ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Step {step} of {maxSteps}
          </p>
        </div>

        <EnhancedCard variant="glass" className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Heart className="w-12 h-12 text-red-500 mx-auto mb-2" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Your Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Help us identify and contact you
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                    placeholder="+1-555-000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe Your Emergency Situation *
                  </label>
                  <textarea
                    value={formData.situation_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, situation_description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Describe what happened and your current situation..."
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: People Count */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Users className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    How Many People Need Help?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Include yourself and anyone with you
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, people_count: count }))}
                      className={`
                        aspect-square rounded-xl border-2 text-xl font-bold transition-all duration-200
                        ${formData.people_count === count
                          ? 'border-red-500 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 scale-110'
                          : 'border-gray-300 dark:border-gray-600 hover:border-red-300 hover:scale-105'
                        }
                      `}
                    >
                      {count}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    More than 8? Enter exact number:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.people_count > 8 ? formData.people_count : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, people_count: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                    placeholder="Enter number"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Medical Conditions */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Heart className="w-12 h-12 text-pink-500 mx-auto mb-2" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Medical Conditions
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select any that apply (helps prioritize response)
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                  {MedicalConditions.map((condition) => (
                    <button
                      key={condition.id}
                      type="button"
                      onClick={() => handleMedicalConditionToggle(condition.id)}
                      className={`
                        flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
                        ${selectedMedicalConditions.includes(condition.id)
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'border-gray-300 dark:border-gray-600 hover:border-red-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }
                      `}
                    >
                      <span className="text-2xl">{condition.icon}</span>
                      <span className="font-medium">{condition.label}</span>
                      {selectedMedicalConditions.includes(condition.id) && (
                        <CheckCircle className="w-5 h-5 ml-auto text-red-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Location */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Your Location
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Help us find you quickly
                  </p>
                </div>

                <div className="space-y-4">
                  <EnhancedButton
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                    variant={hasLocation ? "primary" : "secondary"}
                    icon={isGettingLocation ? Loader2 : hasLocation ? CheckCircle : Navigation}
                    className="w-full text-lg py-4"
                  >
                    {isGettingLocation ? 'Getting Location...' : 
                     hasLocation ? 'Location Obtained' : 'Share My Location'}
                  </EnhancedButton>

                  <div className="text-center">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or describe below</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Describe Your Location
                    </label>
                    <textarea
                      value={formData.location_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="e.g., Building name, floor, room number, landmarks nearby..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <EnhancedButton
                type="button"
                onClick={step === 1 ? () => navigate(-1) : prevStep}
                variant="ghost"
                icon={ArrowLeft}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </EnhancedButton>

              {step < maxSteps ? (
                <EnhancedButton
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  variant="primary"
                >
                  Next
                </EnhancedButton>
              ) : (
                <EnhancedButton
                  type="submit"
                  disabled={isSubmitting || !canProceed()}
                  variant="gradient"
                  icon={isSubmitting ? Loader2 : Send}
                  className="bg-gradient-to-r from-red-500 to-red-600"
                >
                  {isSubmitting ? 'Sending SOS...' : 'Send SOS Request'}
                </EnhancedButton>
              )}
            </div>
          </form>
        </EnhancedCard>

        {/* Emergency Contacts */}
        <div className="mt-6">
          <EmergencyContacts variant="quick" showHeader={true} />
        </div>

        {/* Emergency info */}
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Critical Emergency?</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            For immediate life-threatening emergencies, call the emergency numbers above directly. 
            This SOS form helps coordinate additional rescue resources.
          </p>
        </div>
      </div>
    </div>
  );
}
