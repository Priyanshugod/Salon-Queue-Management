import { useState, useEffect } from 'react';
import { QueueToken, Barber, Service, SalonSettings, QueueAuditLog, BarberStatus, QueueStatus } from '../types';
import { initialBarbers, initialServices, initialTokens, initialSettings } from '../data/mockData';
import { playSalonChime } from '../utils/audioChime';

interface QueueState {
  tokens: QueueToken[];
  barbers: Barber[];
  services: Service[];
  settings: SalonSettings;
  auditLogs: QueueAuditLog[];
}

const STORAGE_KEY = 'cherie_queue_state_v1';
const CHANNEL_NAME = 'cherie_salon_broadcast';

// Initialize state from localStorage or mock data
function loadInitialState(): QueueState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.tokens && parsed.barbers && parsed.services) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load state from localStorage:", e);
  }
  return {
    tokens: initialTokens,
    barbers: initialBarbers,
    services: initialServices,
    settings: initialSettings,
    auditLogs: []
  };
}

let globalState: QueueState = loadInitialState();
const listeners = new Set<(state: QueueState) => void>();
let broadcastChannel: BroadcastChannel | null = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  broadcastChannel.onmessage = (event) => {
    if (event.data?.type === 'SYNC_STATE') {
      globalState = event.data.state;
      listeners.forEach(fn => fn(globalState));
      if (event.data.chime) {
        playSalonChime();
      }
    }
  };
}

function persistAndBroadcast(state: QueueState, triggerChime = false) {
  globalState = state;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Storage quota exceeded or private mode:", e);
  }
  listeners.forEach(fn => fn(globalState));
  if (broadcastChannel) {
    broadcastChannel.postMessage({
      type: 'SYNC_STATE',
      state: globalState,
      chime: triggerChime
    });
  }
  if (triggerChime) {
    playSalonChime();
  }
}

export function useQueueStore() {
  const [state, setState] = useState<QueueState>(globalState);

  useEffect(() => {
    const listener = (newState: QueueState) => setState(newState);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // --- ACTIONS ---

  /**
   * Remote or Walk-in Join Queue
   */
  const joinQueue = (data: {
    customerName: string;
    phone: string;
    services: string[];
    barberPreference: string;
    type?: 'REMOTE' | 'WALK_IN';
  }): { success: boolean; token?: QueueToken; error?: string } => {
    if (!state.settings.masterQueueOpen) {
      return { success: false, error: "Queue is currently closed." };
    }

    // Duplicate Phone Guard (for non-empty phone)
    if (data.phone && data.phone.trim().length > 0) {
      const cleanPhone = data.phone.trim().replace(/\D/g, '');
      const existingActive = state.tokens.find(
        t => t.phone.replace(/\D/g, '') === cleanPhone &&
        (t.status === 'WAITING' || t.status === 'CALLED' || t.status === 'IN_CHAIR')
      );
      if (existingActive) {
        return {
          success: false,
          token: existingActive,
          error: "An active queue token is already registered with this mobile number."
        };
      }
    }

    // Max 3 services guard
    if (data.services.length === 0 || data.services.length > 3) {
      return { success: false, error: "Please select between 1 and 3 services." };
    }

    // Calculate total duration
    const serviceDurationMap = new Map<string, number>();
    state.services.forEach(s => serviceDurationMap.set(s.id, s.durationMinutes));
    const totalEstDuration = data.services.reduce((acc, id) => acc + (serviceDurationMap.get(id) || 25), 0);

    // Generate token number
    const isWalkIn = data.type === 'WALK_IN';
    const prefix = isWalkIn ? 'W' : 'A';
    
    // Find highest token number for prefix
    const existingTokensOfPrefix = state.tokens
      .filter(t => t.token.startsWith(prefix + '-'))
      .map(t => parseInt(t.token.split('-')[1], 10))
      .filter(n => !isNaN(n));
    
    const nextNumber = existingTokensOfPrefix.length > 0 ? Math.max(...existingTokensOfPrefix) + 1 : 101;
    const tokenCode = `${prefix}-${nextNumber}`;

    const newToken: QueueToken = {
      id: `tok-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      token: tokenCode,
      customerName: data.customerName.trim(),
      phone: data.phone.trim(),
      type: isWalkIn ? 'WALK_IN' : 'REMOTE',
      services: data.services,
      barberPreference: data.barberPreference,
      status: 'WAITING',
      assignedBarber: null,
      station: null,
      serviceStartedAt: null,
      estimatedDuration: totalEstDuration,
      joinedAt: new Date().toISOString()
    };

    const nextTokens = [...state.tokens, newToken];
    const newLog: QueueAuditLog = {
      id: `log-${Date.now()}`,
      tokenId: newToken.id,
      tokenCode: newToken.token,
      customerName: newToken.customerName,
      status: 'WAITING',
      timestamp: new Date().toISOString(),
      details: `${isWalkIn ? 'Walk-In' : 'Remote'} check-in for ${newToken.services.length} services`
    };

    persistAndBroadcast({
      ...state,
      tokens: nextTokens,
      auditLogs: [newLog, ...state.auditLogs]
    });

    return { success: true, token: newToken };
  };

  /**
   * Smart FIFO Queue Dispatch for a Barber
   */
  const callNextCustomer = (barberId: string): { success: boolean; token?: QueueToken; error?: string } => {
    const barber = state.barbers.find(b => b.id === barberId);
    if (!barber) return { success: false, error: "Barber not found." };

    // Single-Chair Concurrency Guard: Station must not already have a CALLED or IN_CHAIR client
    if (barber.status === 'BUSY' && barber.currentChairToken) {
      const activeChair = state.tokens.find(t => t.id === barber.currentChairToken);
      if (activeChair && (activeChair.status === 'CALLED' || activeChair.status === 'IN_CHAIR')) {
        return { success: false, error: `Station already occupied by token ${activeChair.token}. Complete current chair first.` };
      }
    }

    // Smart FIFO Dispatch:
    // 1. Filter for WAITING tokens
    // 2. Sort strictly by joinedAt ASC (earliest first)
    // 3. Pick first customer where barberPreference == barberId OR barberPreference == 'ANY'
    const waitingTokens = state.tokens
      .filter(t => t.status === 'WAITING')
      .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());

    const matchedToken = waitingTokens.find(
      t => t.barberPreference === barberId || t.barberPreference === 'ANY'
    );

    if (!matchedToken) {
      return { success: false, error: "No waiting customers available for this station." };
    }

    // Transition matched token to CALLED
    const nextTokens = state.tokens.map(t => {
      if (t.id === matchedToken.id) {
        return {
          ...t,
          status: 'CALLED' as QueueStatus,
          assignedBarber: barber.id,
          station: barber.station
        };
      }
      return t;
    });

    // Update Barber state to BUSY with this token
    const nextBarbers = state.barbers.map(b => {
      if (b.id === barber.id) {
        return {
          ...b,
          status: 'BUSY' as BarberStatus,
          currentChairToken: matchedToken.id
        };
      }
      return b;
    });

    const newLog: QueueAuditLog = {
      id: `log-${Date.now()}`,
      tokenId: matchedToken.id,
      tokenCode: matchedToken.token,
      customerName: matchedToken.customerName,
      status: 'CALLED',
      timestamp: new Date().toISOString(),
      details: `Called to ${barber.name} at ${barber.station}`
    };

    // Trigger state change and sound chime!
    persistAndBroadcast({
      ...state,
      tokens: nextTokens,
      barbers: nextBarbers,
      auditLogs: [newLog, ...state.auditLogs]
    }, true);

    return { success: true, token: matchedToken };
  };

  /**
   * Start Service (Transition from CALLED -> IN_CHAIR)
   */
  const startService = (tokenId: string) => {
    const token = state.tokens.find(t => t.id === tokenId);
    if (!token) return;

    const nextTokens = state.tokens.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          status: 'IN_CHAIR' as QueueStatus,
          serviceStartedAt: new Date().toISOString(),
          gracePeriodExpiresAt: null
        };
      }
      return t;
    });

    const newLog: QueueAuditLog = {
      id: `log-${Date.now()}`,
      tokenId: token.id,
      tokenCode: token.token,
      customerName: token.customerName,
      status: 'IN_CHAIR',
      timestamp: new Date().toISOString(),
      details: `Service started in chair at ${token.station || 'Station'}`
    };

    persistAndBroadcast({
      ...state,
      tokens: nextTokens,
      auditLogs: [newLog, ...state.auditLogs]
    });
  };

  /**
   * Complete Service (Transition from IN_CHAIR -> COMPLETED)
   */
  const completeService = (tokenId: string) => {
    const token = state.tokens.find(t => t.id === tokenId);
    if (!token) return;

    const nextTokens = state.tokens.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          status: 'COMPLETED' as QueueStatus,
          serviceCompletedAt: new Date().toISOString()
        };
      }
      return t;
    });

    // Free up the barber's chair
    const nextBarbers = state.barbers.map(b => {
      if (b.currentChairToken === tokenId || b.id === token.assignedBarber) {
        return {
          ...b,
          status: 'AVAILABLE' as BarberStatus,
          currentChairToken: null,
          completedToday: b.completedToday + 1
        };
      }
      return b;
    });

    const newLog: QueueAuditLog = {
      id: `log-${Date.now()}`,
      tokenId: token.id,
      tokenCode: token.token,
      customerName: token.customerName,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
      details: `Service completed at ${token.station || 'Station'}`
    };

    persistAndBroadcast({
      ...state,
      tokens: nextTokens,
      barbers: nextBarbers,
      auditLogs: [newLog, ...state.auditLogs]
    });
  };

  /**
   * Start 10-Minute Grace Period or Mark No-Show
   */
  const startGracePeriod = (tokenId: string) => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const nextTokens = state.tokens.map(t => {
      if (t.id === tokenId) {
        return { ...t, gracePeriodExpiresAt: expiresAt };
      }
      return t;
    });
    persistAndBroadcast({ ...state, tokens: nextTokens });
  };

  const markNoShow = (tokenId: string) => {
    const token = state.tokens.find(t => t.id === tokenId);
    if (!token) return;

    const nextTokens = state.tokens.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          status: 'NO_SHOW' as QueueStatus,
          gracePeriodExpiresAt: null
        };
      }
      return t;
    });

    // Free barber station if assigned
    const nextBarbers = state.barbers.map(b => {
      if (b.currentChairToken === tokenId || b.id === token.assignedBarber) {
        return {
          ...b,
          status: 'AVAILABLE' as BarberStatus,
          currentChairToken: null
        };
      }
      return b;
    });

    const newLog: QueueAuditLog = {
      id: `log-${Date.now()}`,
      tokenId: token.id,
      tokenCode: token.token,
      customerName: token.customerName,
      status: 'NO_SHOW',
      timestamp: new Date().toISOString(),
      details: `Forfeited after 10-minute timeout`
    };

    persistAndBroadcast({
      ...state,
      tokens: nextTokens,
      barbers: nextBarbers,
      auditLogs: [newLog, ...state.auditLogs]
    });
  };

  /**
   * Cancel Token (User self-cancel or Receptionist remove)
   */
  const cancelToken = (tokenId: string) => {
    const token = state.tokens.find(t => t.id === tokenId);
    if (!token) return;

    const nextTokens = state.tokens.map(t => {
      if (t.id === tokenId) {
        return { ...t, status: 'CANCELLED' as QueueStatus };
      }
      return t;
    });

    // Free barber if assigned
    const nextBarbers = state.barbers.map(b => {
      if (b.currentChairToken === tokenId || b.id === token.assignedBarber) {
        return {
          ...b,
          status: 'AVAILABLE' as BarberStatus,
          currentChairToken: null
        };
      }
      return b;
    });

    const newLog: QueueAuditLog = {
      id: `log-${Date.now()}`,
      tokenId: token.id,
      tokenCode: token.token,
      customerName: token.customerName,
      status: 'CANCELLED',
      timestamp: new Date().toISOString(),
      details: `Queue spot cancelled`
    };

    persistAndBroadcast({
      ...state,
      tokens: nextTokens,
      barbers: nextBarbers,
      auditLogs: [newLog, ...state.auditLogs]
    });
  };

  /**
   * Bump Priority (move up by 1 position among WAITING tokens)
   */
  const bumpPriority = (tokenId: string) => {
    const waiting = state.tokens.filter(t => t.status === 'WAITING');
    const index = waiting.findIndex(t => t.id === tokenId);
    if (index <= 0) return; // already top or not found

    // Swap joinedAt timestamps with the token directly ahead
    const target = waiting[index];
    const ahead = waiting[index - 1];

    const targetTime = target.joinedAt;
    const aheadTime = ahead.joinedAt;

    const nextTokens = state.tokens.map(t => {
      if (t.id === target.id) return { ...t, joinedAt: aheadTime };
      if (t.id === ahead.id) return { ...t, joinedAt: targetTime };
      return t;
    });

    persistAndBroadcast({ ...state, tokens: nextTokens });
  };

  /**
   * Barber Shift Status Control (Available vs On Break)
   */
  const toggleBarberStatus = (barberId: string, newStatus: BarberStatus) => {
    const nextBarbers = state.barbers.map(b => {
      if (b.id === barberId) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    persistAndBroadcast({ ...state, barbers: nextBarbers });
  };

  /**
   * Owner Master Queue & Cutoff Settings
   */
  const toggleMasterQueue = (isOpen: boolean) => {
    persistAndBroadcast({
      ...state,
      settings: { ...state.settings, masterQueueOpen: isOpen }
    });
  };

  const toggleAutoCutoff = (cutoffMinutes: number) => {
    persistAndBroadcast({
      ...state,
      settings: { ...state.settings, autoCutoffMinutes: cutoffMinutes }
    });
  };

  /**
   * Service Catalog Operations
   */
  const toggleServiceActive = (serviceId: string) => {
    const nextServices = state.services.map(s => {
      if (s.id === serviceId) return { ...s, active: !s.active };
      return s;
    });
    persistAndBroadcast({ ...state, services: nextServices });
  };

  const saveService = (service: Service) => {
    const exists = state.services.some(s => s.id === service.id);
    const nextServices = exists
      ? state.services.map(s => (s.id === service.id ? service : s))
      : [...state.services, service];
    persistAndBroadcast({ ...state, services: nextServices });
  };

  /**
   * Barber Staff Operations
   */
  const saveBarber = (barber: Barber) => {
    const exists = state.barbers.some(b => b.id === barber.id);
    const nextBarbers = exists
      ? state.barbers.map(b => (b.id === barber.id ? barber : b))
      : [...state.barbers, barber];
    persistAndBroadcast({ ...state, barbers: nextBarbers });
  };

  /**
   * Daily Reset
   */
  const resetDailyQueue = () => {
    const nextBarbers = state.barbers.map(b => ({
      ...b,
      status: 'AVAILABLE' as BarberStatus,
      currentChairToken: null,
      completedToday: 0
    }));

    persistAndBroadcast({
      ...state,
      tokens: [],
      barbers: nextBarbers,
      auditLogs: []
    });
  };

  return {
    ...state,
    joinQueue,
    callNextCustomer,
    startService,
    completeService,
    startGracePeriod,
    markNoShow,
    cancelToken,
    bumpPriority,
    toggleBarberStatus,
    toggleMasterQueue,
    toggleAutoCutoff,
    toggleServiceActive,
    saveService,
    saveBarber,
    resetDailyQueue
  };
}
