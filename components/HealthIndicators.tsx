
import React from 'react';
import { HealthStatus } from '../types';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

interface HealthIndicatorsProps {
  status: HealthStatus;
  showLabel?: boolean;
}

const HealthIndicators: React.FC<HealthIndicatorsProps> = ({ status, showLabel = false }) => {
  const config = {
    [HealthStatus.NORMAL]: {
      color: 'text-green-600 bg-green-50',
      icon: CheckCircle2,
      label: 'Normal'
    },
    [HealthStatus.BORDERLINE]: {
      color: 'text-yellow-600 bg-yellow-50',
      icon: AlertTriangle,
      label: 'Borderline'
    },
    [HealthStatus.CONCERNING]: {
      color: 'text-red-600 bg-red-50',
      icon: AlertCircle,
      label: 'Concerning'
    },
  };

  const { color, icon: Icon, label } = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {showLabel && <span className="text-xs font-bold uppercase tracking-wide">{label}</span>}
    </div>
  );
};

export default HealthIndicators;
