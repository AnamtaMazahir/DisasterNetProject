import { DisasterTypes } from '@/shared/types';

interface DisasterTypeSelectorProps {
  category: 'natural' | 'man-made';
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

export default function DisasterTypeSelector({ 
  category, 
  selectedType, 
  onTypeSelect 
}: DisasterTypeSelectorProps) {
  const types = DisasterTypes[category];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Select Disaster Type
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onTypeSelect(type.id)}
            className={`
              p-4 rounded-xl border-2 transition-all duration-200
              flex flex-col items-center gap-2 text-center
              ${selectedType === type.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <span className="text-2xl">{type.icon}</span>
            <span className="font-medium text-sm text-gray-900 dark:text-white">
              {type.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
