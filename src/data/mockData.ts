import { Barber, Service, QueueToken, SalonSettings } from '../types';

export const initialBarbers: Barber[] = [
  {
    id: "barber-1",
    name: "Vikram Patel",
    station: "Station 1",
    specialty: "Master Stylist & Beard Specialist",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    status: "BUSY",
    currentChairToken: "tok-101",
    completedToday: 9
  },
  {
    id: "barber-2",
    name: "Aarav Mehta",
    station: "Station 2",
    specialty: "Classic Fades & Scalp Treatments",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    status: "BUSY",
    currentChairToken: "tok-102",
    completedToday: 8
  },
  {
    id: "barber-3",
    name: "Kavita Shah",
    station: "Station 3",
    specialty: "Creative Styling & Hair Coloring",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    status: "AVAILABLE",
    currentChairToken: null,
    completedToday: 7
  },
  {
    id: "barber-4",
    name: "Rohan D'Souza",
    station: "Station 4",
    specialty: "Modern Textures & Royal Shaves",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    status: "ON_BREAK",
    currentChairToken: null,
    completedToday: 6
  }
];

export const initialServices: Service[] = [
  {
    id: "srv-1",
    name: "Signature Haircut & Consultation",
    nameGu: "સિગ્નેચર હેરકટ અને કન્સલ્ટેશન",
    durationMinutes: 30,
    priceINR: 450,
    category: "Hair",
    active: true
  },
  {
    id: "srv-2",
    name: "Executive Beard Sculpt & Hot Towel",
    nameGu: "એક્ઝિક્યુટિવ દાઢી સ્તંભ અને ગરમ ટુવાલ",
    durationMinutes: 20,
    priceINR: 300,
    category: "Beard",
    active: true
  },
  {
    id: "srv-3",
    name: "Chérie Haircut + Beard Combo",
    nameGu: "ચેરી હેરકટ + દાઢી કોમ્બો",
    durationMinutes: 45,
    priceINR: 700,
    category: "Combo",
    active: true
  },
  {
    id: "srv-4",
    name: "Charcoal Detox Facial & Scrub",
    nameGu: "ચારકોલ ડિટોક્સ ફેશિયલ અને સ્ક્રબ",
    durationMinutes: 30,
    priceINR: 650,
    category: "Skin",
    active: true
  },
  {
    id: "srv-5",
    name: "Relaxing Head Massage & Oil Therapy",
    nameGu: "રીલેક્સિંગ હેડ મસાજ અને ઓઇલ થેરાપી",
    durationMinutes: 25,
    priceINR: 400,
    category: "Wellness",
    active: true
  },
  {
    id: "srv-6",
    name: "Beard Grey Blending & Touch-up",
    nameGu: "દાઢી કલર અને ટચ-અપ",
    durationMinutes: 20,
    priceINR: 350,
    category: "Color",
    active: true
  },
  {
    id: "srv-7",
    name: "Deep Conditioning Hair Spa",
    nameGu: "ડીપ કન્ડીશનીંગ હેર સ્પા",
    durationMinutes: 40,
    priceINR: 900,
    category: "Hair",
    active: true
  },
  {
    id: "srv-8",
    name: "Royal Shave & Anti-Stress Cold Mask",
    nameGu: "રોયલ શેવ અને એન્ટી-સ્ટ્રેસ માસ્ક",
    durationMinutes: 25,
    priceINR: 500,
    category: "Beard",
    active: true
  }
];

export const initialTokens: QueueToken[] = [
  {
    id: "tok-101",
    token: "A-101",
    customerName: "Karan Singhania",
    phone: "9820012345",
    type: "REMOTE",
    services: ["srv-3"],
    barberPreference: "barber-1",
    status: "IN_CHAIR",
    assignedBarber: "barber-1",
    station: "Station 1",
    serviceStartedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    estimatedDuration: 45,
    joinedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: "tok-102",
    token: "W-102",
    customerName: "Manish Parekh",
    phone: "9898011223",
    type: "WALK_IN",
    services: ["srv-1"],
    barberPreference: "barber-2",
    status: "IN_CHAIR",
    assignedBarber: "barber-2",
    station: "Station 2",
    serviceStartedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
    estimatedDuration: 30,
    joinedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: "tok-103",
    token: "A-103",
    customerName: "Devang Trivedi",
    phone: "9723456789",
    type: "REMOTE",
    services: ["srv-1", "srv-2"],
    barberPreference: "ANY",
    status: "CALLED",
    assignedBarber: "barber-3",
    station: "Station 3",
    serviceStartedAt: null,
    estimatedDuration: 50,
    joinedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString()
  },
  {
    id: "tok-104",
    token: "A-104",
    customerName: "Nilesh Jadav",
    phone: "9909012345",
    type: "REMOTE",
    services: ["srv-4"],
    barberPreference: "barber-1",
    status: "WAITING",
    assignedBarber: null,
    station: null,
    serviceStartedAt: null,
    estimatedDuration: 30,
    joinedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: "tok-105",
    token: "W-105",
    customerName: "Pooja Desai",
    phone: "9825098765",
    type: "WALK_IN",
    services: ["srv-7"],
    barberPreference: "ANY",
    status: "WAITING",
    assignedBarber: null,
    station: null,
    serviceStartedAt: null,
    estimatedDuration: 40,
    joinedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  }
];

export const initialSettings: SalonSettings = {
  masterQueueOpen: true,
  closingTime: "21:00",
  autoCutoffMinutes: 30
};
