export type QueueStatus = 
  | 'WAITING' 
  | 'CALLED' 
  | 'IN_CHAIR' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export type BarberStatus = 
  | 'AVAILABLE' 
  | 'BUSY' 
  | 'ON_BREAK';

export interface Service {
  id: string;
  name: string;
  nameGu: string;
  durationMinutes: number;
  priceINR: number;
  category: 'Hair' | 'Beard' | 'Combo' | 'Skin' | 'Wellness' | 'Color';
  active: boolean;
}

export interface Barber {
  id: string;
  name: string;
  station: string;
  specialty: string;
  photo: string;
  status: BarberStatus;
  currentChairToken: string | null;
  completedToday: number;
}

export interface QueueToken {
  id: string;
  token: string;
  customerName: string;
  phone: string;
  type: 'REMOTE' | 'WALK_IN';
  services: string[]; // Service IDs
  barberPreference: string; // 'ANY' or Barber ID
  status: QueueStatus;
  assignedBarber: string | null; // Barber ID once CALLED or IN_CHAIR
  station: string | null;
  serviceStartedAt: string | null; // ISO string
  serviceCompletedAt?: string | null;
  estimatedDuration: number; // Total minutes of selected services
  joinedAt: string; // ISO string
  gracePeriodExpiresAt?: string | null; // ISO string for no-show timer
}

export interface SalonSettings {
  masterQueueOpen: boolean;
  closingTime: string; // e.g. "21:00"
  autoCutoffMinutes: number; // e.g. 30
}

export interface QueueAuditLog {
  id: string;
  tokenId: string;
  tokenCode: string;
  customerName: string;
  status: QueueStatus;
  timestamp: string;
  details: string;
}
