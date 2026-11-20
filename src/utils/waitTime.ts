import { Barber, QueueToken, Service } from '../types';

/**
 * Calculates estimated wait time for a customer based on the mathematical formula:
 * (Total Service Minutes of Customers Ahead) / (Active On-Duty Working Barbers)
 */
export function calculateWaitTime(
  token: QueueToken,
  allTokens: QueueToken[],
  barbers: Barber[],
  services: Service[]
): { estimatedMinutes: number; isPaused: boolean; reason?: string } {
  // 1. Identify active on-duty working barbers (Available or Busy)
  const activeBarbers = barbers.filter(b => b.status === 'AVAILABLE' || b.status === 'BUSY');

  // Zero-Barber Fallback Guard
  if (activeBarbers.length === 0) {
    return {
      estimatedMinutes: 0,
      isPaused: true,
      reason: "All barbers are currently on break"
    };
  }

  // If token is already CALLED or IN_CHAIR
  if (token.status === 'CALLED') {
    return { estimatedMinutes: 0, isPaused: false };
  }
  if (token.status === 'IN_CHAIR') {
    return { estimatedMinutes: 0, isPaused: false };
  }
  if (token.status === 'COMPLETED' || token.status === 'CANCELLED' || token.status === 'NO_SHOW') {
    return { estimatedMinutes: 0, isPaused: false };
  }

  // Service lookup map for fast duration calculation
  const serviceDurationMap = new Map<string, number>();
  services.forEach(s => serviceDurationMap.set(s.id, s.durationMinutes));

  const getTokenServiceDuration = (t: QueueToken): number => {
    return t.services.reduce((acc, sId) => acc + (serviceDurationMap.get(sId) || 25), 0);
  };

  // Specific Barber calculation
  if (token.barberPreference !== 'ANY') {
    const targetBarber = barbers.find(b => b.id === token.barberPreference);
    if (!targetBarber || targetBarber.status === 'ON_BREAK') {
      return {
        estimatedMinutes: 45,
        isPaused: targetBarber?.status === 'ON_BREAK',
        reason: "Preferred stylist is currently on break"
      };
    }

    // Remaining duration of current chair for this barber
    let currentChairRemaining = 0;
    if (targetBarber.status === 'BUSY' && targetBarber.currentChairToken) {
      const activeChairToken = allTokens.find(t => t.id === targetBarber.currentChairToken);
      if (activeChairToken && activeChairToken.serviceStartedAt) {
        const elapsedMins = (Date.now() - new Date(activeChairToken.serviceStartedAt).getTime()) / (60 * 1000);
        const totalDuration = getTokenServiceDuration(activeChairToken);
        currentChairRemaining = Math.max(5, Math.round(totalDuration - elapsedMins));
      } else {
        currentChairRemaining = 20;
      }
    }

    // Sum service durations of waiting tokens ahead that requested this barber or "ANY"
    const waitingAhead = allTokens.filter(t => 
      t.status === 'WAITING' && 
      new Date(t.joinedAt).getTime() < new Date(token.joinedAt).getTime() &&
      (t.barberPreference === token.barberPreference || t.barberPreference === 'ANY')
    );

    const queueDuration = waitingAhead.reduce((acc, t) => acc + getTokenServiceDuration(t), 0);
    return {
      estimatedMinutes: Math.max(5, currentChairRemaining + queueDuration),
      isPaused: false
    };
  }

  // "Any Barber" calculation
  // Sum of estimated remaining time for all currently occupied chairs
  let totalActiveRemaining = 0;
  activeBarbers.forEach(barber => {
    if (barber.status === 'BUSY' && barber.currentChairToken) {
      const activeChairToken = allTokens.find(t => t.id === barber.currentChairToken);
      if (activeChairToken && activeChairToken.serviceStartedAt) {
        const elapsedMins = (Date.now() - new Date(activeChairToken.serviceStartedAt).getTime()) / (60 * 1000);
        const totalDuration = getTokenServiceDuration(activeChairToken);
        totalActiveRemaining += Math.max(5, Math.round(totalDuration - elapsedMins));
      } else {
        totalActiveRemaining += 15;
      }
    }
  });

  // Sum of service durations of ALL waiting tokens ahead
  const waitingAhead = allTokens.filter(t => 
    t.status === 'WAITING' && 
    new Date(t.joinedAt).getTime() < new Date(token.joinedAt).getTime()
  );

  const totalWaitingDuration = waitingAhead.reduce((acc, t) => acc + getTokenServiceDuration(t), 0);
  const totalMinutes = totalActiveRemaining + totalWaitingDuration;
  const estimated = Math.max(3, Math.round(totalMinutes / activeBarbers.length));

  return {
    estimatedMinutes: estimated,
    isPaused: false
  };
}

/**
 * Calculates current global wait estimate for new incoming users
 */
export function getGlobalWaitEstimate(
  allTokens: QueueToken[],
  barbers: Barber[],
  services: Service[]
): { waitMinutes: number; countInLine: number; activeBarberCount: number } {
  const activeBarbers = barbers.filter(b => b.status === 'AVAILABLE' || b.status === 'BUSY');
  const waitingTokens = allTokens.filter(t => t.status === 'WAITING');

  if (activeBarbers.length === 0) {
    return {
      waitMinutes: 0,
      countInLine: waitingTokens.length,
      activeBarberCount: 0
    };
  }

  const serviceDurationMap = new Map<string, number>();
  services.forEach(s => serviceDurationMap.set(s.id, s.durationMinutes));

  const totalWaitingDuration = waitingTokens.reduce((acc, t) => {
    const dur = t.services.reduce((sAcc, sId) => sAcc + (serviceDurationMap.get(sId) || 25), 0);
    return acc + dur;
  }, 0);

  const avgMinutes = Math.max(5, Math.round(totalWaitingDuration / activeBarbers.length));
  return {
    waitMinutes: avgMinutes,
    countInLine: waitingTokens.length,
    activeBarberCount: activeBarbers.length
  };
}
