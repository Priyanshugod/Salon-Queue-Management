import React from 'react';
import { QueueStatus, BarberStatus } from '../../types';

interface BadgeProps {
  status: QueueStatus | BarberStatus | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  let colorClasses = 'bg-[#F7EFEB] text-[#5A5550] border-[#E8E0D8]';

  switch (status) {
    case 'AVAILABLE':
      colorClasses = 'bg-[#EAF3ED] text-[#3D7C57] border-[#C3DEC9] font-medium';
      break;
    case 'BUSY':
    case 'IN_CHAIR':
      colorClasses = 'bg-[#FDF0EC] text-[#E07A5F] border-[#F7CEBE] font-medium';
      break;
    case 'ON_BREAK':
      colorClasses = 'bg-[#FDF7E7] text-[#C59B3F] border-[#F4E4AF] font-medium';
      break;
    case 'CALLED':
      colorClasses = 'bg-[#FCEEEA] text-[#E57B62] border-[#E57B62] font-semibold animate-pulse';
      break;
    case 'WAITING':
      colorClasses = 'bg-[#FAF7F2] text-[#5A5550] border-[#E8E0D8] font-medium';
      break;
    case 'COMPLETED':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      break;
    case 'CANCELLED':
    case 'NO_SHOW':
      colorClasses = 'bg-red-50 text-red-700 border-red-200';
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border uppercase tracking-wider font-sans ${sizeClasses} ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {status.replace('_', ' ')}
    </span>
  );
};
