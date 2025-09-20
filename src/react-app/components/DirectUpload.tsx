import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useReports } from '@/react-app/hooks/useReports';
import EnhancedButton from './EnhancedButton';
import EnhancedCard from './EnhancedCard';
import SeverityBadge from './SeverityBadge';
import DisasterTypeSelector from './DisasterTypeSelector';
import { 
  Upload, 
  Camera, 
  Video, 
  FileText, 
  X, 
  Sparkles, 
  MapPin, 
  Edit3,
  CheckCircle,
  AlertTriangle,
  Mic,
  ArrowLeft
} from 'lucide-react';

interface DirectUploadProps {
  onClose?: () => void;
  autoOpen?: boolean;
}

interface AIDetectionResult {
  disaster_type: string;
  category: 'natural' | 'man-made';
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
  recommendation: string;
}

type UploadMode = 'selection' | 'image' | 'video' | 'text' | 'voice' | 'processing' | 'results';

export default function DirectUpload({ onClose, autoOpen = false }: DirectUploadProps) {
  const navigate = useNavigate();
  const { addReport } = useReports();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // Stable state management
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [mode, setMode] = useState<UploadMode>('selection');
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    textReport: '',
    preview: '',
    uploadType: null as 'image' | 'video' | 'text' | 'voice' | null
  });
  const [aiResult, setAiResult] = useState<AIDetectionResult | null>(null);
  const [userOverride, setUserOverride] = useState(false);
  const [manualSelection, setManualSelection] = useState({
    disaster_type: '',
    category: 'natural' as 'natural' | 'man-made'
  });
  const [location] = useState({
    name: 'Mumbai, Maharashtra',
    latitude: 19.0760,
    longitude: 72.8777
  });

  // Mock AI detection function
  const performAIDetection = async (content: string | File): Promise<AIDetectionResult> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

    let detectedType = 'earthquake';
    let category: 'natural' | 'man-made' = 'natural';
    let confidence = 0.85;
    let severity: 'low' | 'medium' | 'high' = 'medium';

    if (content instanceof File) {
      const fileName = content.name.toLowerCase();
      if (fileName.includes('fire') || fileName.includes('burn')) {
        detectedType = 'fire';
        category = 'man-made';
        severity = 'high';
        confidence = 0.92;
      } else if (fileName.includes('flood') || fileName.includes('water')) {
        detectedType = 'flood';
        category = 'natural';
        severity = 'high';
        confidence = 0.88;
      } else if (fileName.includes('earthquake') || fileName.includes('building')) {
        detectedType = 'earthquake';
        category = 'natural';
        severity = 'high';
        confidence = 0.94;
      }
    } else {
      const text = content.toLowerCase();
      if (text.includes('fire') || text.includes('burn') || text.includes('smoke')) {
        detectedType = 'fire';
        category = 'man-made';
        severity = 'high';
        confidence = 0.89;
      } else if (text.includes('flood') || text.includes('water') || text.includes('rain')) {
        detectedType = 'flood';
        category = 'natural';
        severity = 'medium';
        confidence = 0.76;
      } else if (text.includes('earthquake') || text.includes('shake') || text.includes('tremor')) {
        detectedType = 'earthquake';
        category = 'natural';
        severity = 'high';
        confidence = 0.91;
      } else if (text.includes('explosion') || text.includes('blast')) {
        detectedType = 'explosion';
        category = 'man-made';
        severity = 'high';
        confidence = 0.87;
      } else if (text.includes('cyclone') || text.includes('storm') || text.includes('wind')) {
        detectedType = 'cyclone';
        category = 'natural';
        severity = 'medium';
        confidence = 0.73;
      }
    }

    const recommendations = {
      low: 'Continue monitoring. Pre-position emergency resources.',
      medium: 'Prepare evacuation routes. Alert emergency services.',
      high: 'Immediate evacuation required. Deploy emergency response teams.'
    };

    return {
      disaster_type: detectedType,
      category,
      confidence,
      severity,
      suggestion: `Based on analysis, this appears to be a ${detectedType} event`,
      recommendation: recommendations[severity]
    };
  };

  // Handle file selection
  const handleFileSelection = (selectedFile: File, type: 'image' | 'video') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadData({
        file: selectedFile,
        textReport: '',
        preview: e.target?.result as string,
        uploadType: type
      });
      setMode(type);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle text input
  const handleTextInput = (text: string) => {
    setUploadData({
      file: null,
      textReport: text,
      preview: '',
      uploadType: 'text'
    });
    setMode('text');
  };

  // Process content with AI
  const processContent = async () => {
    setMode('processing');
    setAiResult(null);
    
    try {
      const content = uploadData.file || uploadData.textReport;
      if (!content) return;
      
      const result = await performAIDetection(content);
      setAiResult(result);
      setMode('results');
    } catch (error) {
      console.error('AI detection failed:', error);
      setMode(uploadData.uploadType || 'selection');
    }
  };

  // Submit final report
  const handleSubmit = () => {
    if (!aiResult) return;

    const finalType = userOverride ? manualSelection.disaster_type : aiResult.disaster_type;
    const finalCategory = userOverride ? manualSelection.category : aiResult.category;
    
    if (!finalType || !finalCategory) return;

    const newReport = {
      title: `${finalType.charAt(0).toUpperCase() + finalType.slice(1).replace(/_/g, ' ')} Report`,
      description: uploadData.textReport || `Report submitted via ${uploadData.uploadType || 'upload'}`,
      disaster_type: finalType,
      category: finalCategory,
      severity: aiResult.severity,
      confidence: aiResult.confidence,
      recommendation: aiResult.recommendation,
      status: 'pending' as const,
      latitude: location.latitude,
      longitude: location.longitude,
      location_name: location.name,
      image_url: uploadData.preview || undefined,
    };

    addReport(newReport);
    handleClose();
    navigate('/reports');
  };

  // Reset everything
  const resetState = () => {
    setMode('selection');
    setUploadData({
      file: null,
      textReport: '',
      preview: '',
      uploadType: null
    });
    setAiResult(null);
    setUserOverride(false);
    setManualSelection({ disaster_type: '', category: 'natural' });
  };

  // Close modal
  const handleClose = () => {
    setIsOpen(false);
    resetState();
    if (onClose) onClose();
  };

  // Go back to previous step
  const goBack = () => {
    if (mode === 'results') {
      setMode(uploadData.uploadType || 'selection');
    } else if (mode !== 'selection') {
      setMode('selection');
    }
  };

  if (!isOpen) {
    return (
      <EnhancedButton
        onClick={() => setIsOpen(true)}
        variant="gradient"
        size="xl"
        icon={Upload}
        className="w-full"
      >
        Report Now
      </EnhancedButton>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <EnhancedCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {mode !== 'selection' && (
                <button
                  onClick={goBack}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Report Disaster
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Selection */}
          {mode === 'selection' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  How would you like to report?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose the method that best fits your situation
                </p>
              </div>

              <div className="grid gap-4">
                {/* Image/Video Upload */}
                <div className="grid grid-cols-2 gap-4">
                  <EnhancedCard 
                    variant="glass" 
                    hover 
                    className="p-6 cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Image</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Take or upload photos of the incident
                      </p>
                    </div>
                  </EnhancedCard>

                  <EnhancedCard 
                    variant="glass" 
                    hover 
                    className="p-6 cursor-pointer group"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Video className="w-12 h-12 text-purple-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Video</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Record or upload video evidence
                      </p>
                    </div>
                  </EnhancedCard>
                </div>

                {/* Text Report */}
                <EnhancedCard 
                  variant="glass" 
                  hover 
                  className="p-6 cursor-pointer group"
                  onClick={() => setMode('text')}
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-12 h-12 text-green-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Text Report</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Describe what you're seeing or experiencing
                      </p>
                    </div>
                  </div>
                </EnhancedCard>

                {/* Voice Note (Stubbed) */}
                <EnhancedCard 
                  variant="glass" 
                  className="p-6 opacity-50"
                >
                  <div className="flex items-center gap-4">
                    <Mic className="w-12 h-12 text-orange-500" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Voice Note</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Record voice description (Coming Soon)
                      </p>
                    </div>
                  </div>
                </EnhancedCard>
              </div>

              {/* Location Info */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <MapPin className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Current Location
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {location.name}
                  </p>
                </div>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0], 'image')}
                className="hidden"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0], 'video')}
                className="hidden"
              />
            </div>
          )}

          {/* Image Upload Mode */}
          {mode === 'image' && uploadData.preview && (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={uploadData.preview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <EnhancedButton
                  onClick={resetState}
                  variant="secondary"
                >
                  Change Image
                </EnhancedButton>
                <EnhancedButton
                  onClick={processContent}
                  variant="gradient"
                  icon={Sparkles}
                  className="flex-1"
                >
                  Analyze with AI
                </EnhancedButton>
              </div>
            </div>
          )}

          {/* Video Upload Mode */}
          {mode === 'video' && uploadData.preview && (
            <div className="space-y-4">
              <div className="relative">
                <video 
                  src={uploadData.preview} 
                  controls 
                  className="w-full h-64 rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <EnhancedButton
                  onClick={resetState}
                  variant="secondary"
                >
                  Change Video
                </EnhancedButton>
                <EnhancedButton
                  onClick={processContent}
                  variant="gradient"
                  icon={Sparkles}
                  className="flex-1"
                >
                  Analyze with AI
                </EnhancedButton>
              </div>
            </div>
          )}

          {/* Text Input Mode */}
          {mode === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe the situation
                </label>
                <textarea
                  value={uploadData.textReport}
                  onChange={(e) => handleTextInput(e.target.value)}
                  placeholder="Describe what you're seeing or experiencing..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex gap-3">
                <EnhancedButton
                  onClick={() => setMode('selection')}
                  variant="secondary"
                >
                  Back
                </EnhancedButton>
                <EnhancedButton
                  onClick={processContent}
                  variant="gradient"
                  icon={Sparkles}
                  disabled={!uploadData.textReport.trim()}
                  className="flex-1"
                >
                  Analyze with AI
                </EnhancedButton>
              </div>
            </div>
          )}

          {/* Processing Mode */}
          {mode === 'processing' && (
            <div className="text-center py-12">
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI Analyzing Content...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI is processing your submission to detect the disaster type and assess severity
              </p>
            </div>
          )}

          {/* Results Mode */}
          {mode === 'results' && aiResult && (
            <div className="space-y-6">
              {/* AI Results Card */}
              <EnhancedCard variant="gradient" gradient="green" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI Detection Complete
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Detected: {aiResult.disaster_type.replace(/_/g, ' ').toUpperCase()}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      {aiResult.suggestion}
                    </p>
                    <SeverityBadge 
                      severity={aiResult.severity} 
                      confidence={aiResult.confidence} 
                    />
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Recommended Action:
                    </h5>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {aiResult.recommendation}
                    </p>
                  </div>
                </div>
              </EnhancedCard>

              {/* Override Section */}
              <EnhancedCard variant="glass" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Edit3 className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Need to override detection?
                  </h4>
                </div>

                {!userOverride ? (
                  <EnhancedButton
                    onClick={() => setUserOverride(true)}
                    variant="secondary"
                    size="sm"
                    icon={AlertTriangle}
                  >
                    Manual Override
                  </EnhancedButton>
                ) : (
                  <div className="space-y-4">
                    <DisasterTypeSelector
                      category={manualSelection.category}
                      selectedType={manualSelection.disaster_type}
                      onTypeSelect={(type) => setManualSelection(prev => ({ ...prev, disaster_type: type }))}
                    />
                    
                    <div className="flex gap-2">
                      <EnhancedButton
                        onClick={() => setUserOverride(false)}
                        variant="ghost"
                        size="sm"
                      >
                        Cancel Override
                      </EnhancedButton>
                    </div>
                  </div>
                )}
              </EnhancedCard>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <EnhancedButton
                  onClick={resetState}
                  variant="secondary"
                >
                  Start Over
                </EnhancedButton>
                <EnhancedButton
                  onClick={handleSubmit}
                  variant="gradient"
                  icon={CheckCircle}
                  disabled={userOverride && !manualSelection.disaster_type}
                  className="flex-1"
                >
                  Submit Report
                </EnhancedButton>
              </div>
            </div>
          )}
        </div>
      </EnhancedCard>
    </div>
  );
}
