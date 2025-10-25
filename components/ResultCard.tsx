
import React from 'react';
import { DiagnosisResult, DiagnosisStatus } from '../types';
import { CheckCircleIcon, WarningIcon } from './IconComponents';

interface ResultCardProps {
  result: DiagnosisResult;
}

const getStatusStyles = (status: DiagnosisStatus) => {
  switch (status) {
    case DiagnosisStatus.Healthy:
      return {
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-400',
        borderColor: 'border-green-500/30',
        Icon: CheckCircleIcon,
      };
    case DiagnosisStatus.Diseased:
      return {
        bgColor: 'bg-yellow-500/10',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
        Icon: WarningIcon,
      };
    default:
      return {
        bgColor: 'bg-gray-500/10',
        textColor: 'text-gray-400',
        borderColor: 'border-gray-500/30',
        Icon: WarningIcon,
      };
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { diagnosis, confidence, reasoning } = result;
  const { bgColor, textColor, borderColor, Icon } = getStatusStyles(diagnosis);
  const confidencePercentage = (confidence * 100).toFixed(0);

  return (
    <div className={`w-full p-6 rounded-lg shadow-md animate-fade-in flex flex-col ${bgColor} ${borderColor} border`}>
      <div className="flex items-center mb-4">
        <Icon className={`w-8 h-8 mr-3 ${textColor}`} />
        <h2 className={`text-2xl font-bold ${textColor}`}>{diagnosis}</h2>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-400">Confidence</span>
          <span className={`text-sm font-bold ${textColor}`}>{confidencePercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className={`bg-gradient-to-r ${
              diagnosis === DiagnosisStatus.Healthy ? 'from-green-500 to-green-400' : 'from-yellow-500 to-yellow-400'
            } h-2.5 rounded-full`}
            style={{ width: `${confidencePercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold text-gray-300 mb-2">AI Reasoning:</h3>
        <p className="text-sm text-gray-400">{reasoning}</p>
      </div>
    </div>
  );
};

// Add fade-in animation to tailwind config or a style tag if needed.
// For simplicity here, we can rely on a simple keyframe animation in a style tag in index.html if this file can't access it.
// Or we can add it to tailwind.config.js
// In this setup, let's assume a simple CSS class is defined.
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
