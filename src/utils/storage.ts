import { CoupleState } from '../types/couple';
import { HouseState } from '../types/house';
import { QAState } from '../types/qa';
import { DEFAULT_ROOMS, FURNITURE_CATALOG, INITIAL_PLACED_FURNITURE } from '../data/defaultFurniture';

const STORAGE_KEYS = {
  COUPLE: 'hazel_couple_state_v1',
  HOUSE: 'hazel_house_state_v1',
  QA: 'hazel_qa_state_v1',
};

// Initial default couple state
export const DEFAULT_COUPLE_STATE: CoupleState = {
  partner1: {
    id: 'partner1',
    name: 'Luna',
    avatar: '🌸',
    location: 'Barcelona, España',
    timezone: 'GMT+2',
    statusMessage: 'Contando los días para vernos ✨',
    currentMood: {
      emoji: '🥰',
      label: 'Enamorada & Acogedora',
      energy: 85,
      note: 'Pensando en el café que nos tomaremos juntos.',
      updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      color: '#FFB7B2',
    },
  },
  partner2: {
    id: 'partner2',
    name: 'Mateo',
    avatar: '🐻',
    location: 'Buenos Aires, Argentina',
    timezone: 'GMT-3',
    statusMessage: 'Trabajando con nuestra playlist de fondo 🎶',
    currentMood: {
      emoji: '✨',
      label: 'Motivado & Te Extraño',
      energy: 70,
      note: 'Terminando pendientes para hacer videollamada.',
      updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      color: '#B5EAD7',
    },
  },
  activePartnerId: 'partner1',
  relationshipStartDate: '2024-05-20T00:00:00.000Z',
  nextMeetupDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(), // 18 days away
  loveCoins: 180,
  level: 2,
  experience: 350,
  streakDays: 14,
  loveNotes: [
    {
      id: 'note_1',
      from: 'partner2',
      text: 'Buenos días mi vida, espero que tengas un día hermoso. No olvides tomar agua 💖',
      sticker: '💌',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      isRead: true,
    },
    {
      id: 'note_2',
      from: 'partner1',
      text: 'Anoche soñé con nuestro viaje a la playa 🌊 Te amo mucho!',
      sticker: '✨',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      isRead: true,
    }
  ],
  recentInteractions: [
    {
      id: 'int_1',
      from: 'partner2',
      type: 'hug',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      message: 'Mateo te envió un abrazo cálido y apretadito.',
    }
  ],
};

// Initial default house state
export const DEFAULT_HOUSE_STATE: HouseState = {
  currentRoomId: 'living_room',
  rooms: DEFAULT_ROOMS,
  placedItems: INITIAL_PLACED_FURNITURE,
  activityLogs: [
    {
      id: 'act_1',
      partnerId: 'partner2',
      action: 'placed',
      itemName: 'Marco Dorado con Nuestra Foto',
      roomName: 'Salón Acogedor',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      icon: '🖼️',
    },
    {
      id: 'act_2',
      partnerId: 'partner1',
      action: 'placed',
      itemName: 'Gatito Mochi',
      roomName: 'Salón Acogedor',
      timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      icon: '🐱',
    }
  ],
  inventory: FURNITURE_CATALOG.filter(f => f.price <= 60).map(f => f.id),
};

// Initial default QA state
export const DEFAULT_QA_STATE: QAState = {
  dailyQuestionId: 'q_intimacy_1',
  activeDeckCategory: 'all',
  records: {
    'q_intimacy_1': {
      id: 'ans_1',
      questionId: 'q_intimacy_1',
      partner1Answer: 'Fue aquella noche que nos quedamos hablando por videollamada hasta las 4 de la mañana riéndonos de cualquier tontería. Sentí tanta paz que supe que eras tú.',
      partner1AnsweredAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      partner2Answer: 'Cuando me mandaste ese mensaje de voz cantando desafinada para hacerme sonreír porque había tenido un mal día en el trabajo. Me robaste el corazón por completo.',
      partner2AnsweredAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      isRevealed: true,
      revealedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      reactions: {
        partner1Emoji: '🥹',
        partner2Emoji: '❤️',
      },
      rewardClaimed: true,
    },
    'q_dreams_1': {
      id: 'ans_2',
      questionId: 'q_dreams_1',
      partner1Answer: 'Con un balcón grande lleno de plantas, un ventanal con luz dorada al atardecer y un espacio amplio para que cocinemos escuchando música.',
      partner1AnsweredAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      partner2Answer: undefined, // Partner 2 hasn't answered yet! Good for testing blind reveal
      isRevealed: false,
      reactions: {},
      rewardClaimed: false,
    }
  },
  customQuestions: [
    {
      id: 'q_custom_1',
      category: 'custom',
      categoryLabel: 'Pregunta de Luna',
      categoryEmoji: '💌',
      accentColor: '#FF9EAA',
      title: 'Sorpresa Especial',
      prompt: '¿Qué es lo primero que quieres que cocinemos juntos en persona cuando termine este mes?',
      isCustom: true,
      createdBy: 'partner1',
      rewardHearts: 40,
    }
  ],
};

// Generadores de estado limpio para parejas nuevas (iniciando desde cero)
export const createFreshCoupleState = (name: string, avatar: string, location: string): CoupleState => ({
  partner1: {
    id: 'partner1',
    name: name || 'Yo',
    avatar: avatar || '🌸',
    location: location || 'Nuestro Hogar',
    timezone: 'GMT+1',
    statusMessage: '¡Comenzando nuestra casita juntos! 🏡✨',
    currentMood: {
      emoji: '🥰',
      label: 'Feliz & Emocionado/a',
      energy: 90,
      note: '¡Acabamos de crear nuestra casita!',
      updatedAt: new Date().toISOString(),
      color: '#FFB7B2',
    },
  },
  partner2: {
    id: 'partner2',
    name: 'Mi Pareja',
    avatar: '🐻',
    location: '',
    timezone: 'GMT+1',
    statusMessage: 'Esperando conectarse 💖',
    currentMood: {
      emoji: '✨',
      label: 'Esperando conexión',
      energy: 80,
      note: '',
      updatedAt: new Date().toISOString(),
      color: '#B5EAD7',
    },
  },
  activePartnerId: 'partner1',
  relationshipStartDate: new Date().toISOString(),
  nextMeetupDate: null,
  loveCoins: 100, // 100 monedas de bienvenida de regalo
  level: 1,
  experience: 0,
  streakDays: 1, // Día 1 de racha juntos
  loveNotes: [], // Buzón de recuerdos completamente limpio
  recentInteractions: [],
});

export const createFreshHouseState = (): HouseState => ({
  currentRoomId: 'living_room',
  rooms: {
    ...DEFAULT_ROOMS,
    living_room: { ...DEFAULT_ROOMS.living_room, unlocked: true },
    kitchen: { ...DEFAULT_ROOMS.kitchen, unlocked: false },
    bedroom: { ...DEFAULT_ROOMS.bedroom, unlocked: false },
    balcony: { ...DEFAULT_ROOMS.balcony, unlocked: false },
    garden: { ...DEFAULT_ROOMS.garden, unlocked: false },
  },
  placedItems: [], // Vacío: para partir de a poco decorando juntos
  activityLogs: [
    {
      id: 'act_init_' + Date.now(),
      partnerId: 'partner1',
      action: 'placed',
      itemName: 'Inauguración de la Casita',
      roomName: 'Salón Acogedor',
      timestamp: new Date().toISOString(),
      icon: '🏡',
    }
  ],
  inventory: ['rug_heart_pink', 'plant_monstera'], // 2 regalos acogedores de bienvenida listos para colocar
});

export const createFreshQAState = (): QAState => ({
  dailyQuestionId: 'q_intimacy_1',
  activeDeckCategory: 'all',
  records: {}, // 0 preguntas respondidas, mazo virgen para estrenar
  customQuestions: [],
});

// Broadcast channel for multi-tab sync
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('hazel_sync_channel')
  : null;

export const loadStoredData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
};

export const saveStoredData = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (syncChannel) {
      syncChannel.postMessage({ type: 'SYNC_UPDATE', key });
    }
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

export const subscribeToSync = (callback: (key: string) => void) => {
  if (!syncChannel) return () => {};
  const handler = (event: MessageEvent) => {
    if (event.data && event.data.type === 'SYNC_UPDATE') {
      callback(event.data.key);
    }
  };
  syncChannel.addEventListener('message', handler);
  return () => syncChannel.removeEventListener('message', handler);
};

export const clearAllData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.COUPLE);
  localStorage.removeItem(STORAGE_KEYS.HOUSE);
  localStorage.removeItem(STORAGE_KEYS.QA);
  window.location.reload();
};
