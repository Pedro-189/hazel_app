import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { CoupleState, Partner, PartnerId, LoveNote, InteractionEvent } from '../types/couple';
import { HouseState, RoomId, Room, PlacedFurniture, FurnitureItem, HouseActivityLog } from '../types/house';
import { QAState, Question, QuestionAnswerRecord, QuestionCategory } from '../types/qa';
import { 
  DEFAULT_COUPLE_STATE, 
  DEFAULT_HOUSE_STATE, 
  DEFAULT_QA_STATE, 
  createFreshCoupleState,
  createFreshHouseState,
  createFreshQAState,
  loadStoredData, 
  saveStoredData, 
  subscribeToSync 
} from '../utils/storage';
import { FURNITURE_CATALOG } from '../data/defaultFurniture';
import { DEFAULT_QUESTIONS } from '../data/questionDeck';
import { sound } from '../utils/audio';

import { UserProfile, CouplePairing } from '../types/auth';
import { 
  fetchRemoteCouple, 
  syncToRemoteCouple, 
  subscribeToRemoteCouple, 
  broadcastFastInteraction,
  RemoteCoupleRow
} from '../utils/supabaseSync';
import { isSupabaseConfigured } from '../utils/supabaseClient';

interface CoupleContextValue {
  couple: CoupleState;
  house: HouseState;
  qa: QAState;
  activePartner: Partner;
  otherPartner: Partner;
  allQuestions: Question[];
  furnitureCatalog: FurnitureItem[];
  floatingEffects: Array<{ id: string; type: string; message?: string }>;
  isMuted: boolean;
  toggleMute: () => void;
  
  // Auth & Pairing
  currentUser: UserProfile | null;
  pairing: CouplePairing;
  loginUser: (name: string, avatar: string, location: string) => void;
  loginWithExistingCode: (name: string, avatar: string, location: string, coupleCode: string) => boolean;
  createCoupleInviteCode: () => string;
  joinCoupleByCode: (code: string) => boolean;
  logoutUser: () => void;
  startDemoMode: () => void;
  
  // Partner & Mood Actions
  switchActivePartner: (id: PartnerId) => void;
  updatePartnerProfile: (partnerId: PartnerId, updates: Partial<Partner>) => void;
  updateMood: (emoji: string, label: string, energy: number, note: string, color: string) => void;
  sendInteraction: (type: InteractionEvent['type'], customMessage?: string) => void;
  addLoveNote: (text: string, sticker?: string) => void;
  updateMeetupDate: (dateString: string | null) => void;

  // Economy & Progression
  addLoveCoins: (amount: number, reason?: string) => void;
  spendLoveCoins: (amount: number) => boolean;

  // House Actions
  changeRoom: (roomId: RoomId) => void;
  unlockRoom: (roomId: RoomId) => boolean;
  updateRoomTheme: (roomId: RoomId, wallColor: string, floorType: Room['floorType']) => void;
  buyFurniture: (furnitureId: string) => boolean;
  placeFurniture: (furnitureId: string, x: number, y: number, roomId?: RoomId) => void;
  moveFurniture: (placedId: string, x: number, y: number) => void;
  rotateFurniture: (placedId: string) => void;
  changeFurnitureLayer: (placedId: string, delta: number) => void;
  removeFurniture: (placedId: string) => void;
  setCustomPhotoOnFrame: (placedId: string, photoUrl: string, note?: string) => void;
  interactWithFurniture: (placedId: string) => void;

  // QA Actions
  submitAnswer: (questionId: string, text: string) => void;
  addReactionToAnswer: (questionId: string, emoji: string) => void;
  createCustomQuestion: (title: string, prompt: string, category?: QuestionCategory) => void;
  setDailyQuestion: (questionId: string) => void;
  dismissEffect: (id: string) => void;
}

const CoupleContext = createContext<CoupleContextValue | null>(null);

export const CoupleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    loadStoredData<UserProfile | null>('hazel_auth_user_v1', null)
  );

  const [pairing, setPairing] = useState<CouplePairing>(() =>
    loadStoredData<CouplePairing>('hazel_couple_pairing_v1', {
      coupleCode: '',
      creatorName: '',
      creatorAvatar: '',
      isLinked: false,
    })
  );

  const [couple, setCouple] = useState<CoupleState>(() =>
    loadStoredData('hazel_couple_state_v1', DEFAULT_COUPLE_STATE)
  );
  const [house, setHouse] = useState<HouseState>(() =>
    loadStoredData('hazel_house_state_v1', DEFAULT_HOUSE_STATE)
  );
  const [qa, setQA] = useState<QAState>(() =>
    loadStoredData('hazel_qa_state_v1', DEFAULT_QA_STATE)
  );

  const [floatingEffects, setFloatingEffects] = useState<Array<{ id: string; type: string; message?: string }>>([]);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());

  // Save changes to localStorage
  useEffect(() => {
    saveStoredData('hazel_auth_user_v1', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStoredData('hazel_couple_pairing_v1', pairing);
  }, [pairing]);

  useEffect(() => {
    saveStoredData('hazel_couple_state_v1', couple);
  }, [couple]);

  useEffect(() => {
    saveStoredData('hazel_house_state_v1', house);
  }, [house]);

  useEffect(() => {
    saveStoredData('hazel_qa_state_v1', qa);
  }, [qa]);

  // SUPABASE REALTIME SYNC & HYDRATION
  useEffect(() => {
    const code = pairing.coupleCode;
    if (!code || !isSupabaseConfigured) return;

    let isMounted = true;

    // 1. Initial Remote Fetch on load
    fetchRemoteCouple(code).then((remote) => {
      if (remote && isMounted) {
        if (remote.couple_data && Object.keys(remote.couple_data).length > 0) {
          setCouple(remote.couple_data);
        }
        if (remote.house_data && Object.keys(remote.house_data).length > 0) {
          setHouse(remote.house_data);
        }
        if (remote.qa_data && Object.keys(remote.qa_data).length > 0) {
          setQA(remote.qa_data);
        }
      } else if (!remote && isMounted) {
        // First time room creation in cloud: push initial state
        syncToRemoteCouple(code, couple, house, qa, currentUser?.id || 'local_user');
      }
    });

    // 2. Realtime Subscription to partner's changes
    const unsubscribe = subscribeToRemoteCouple(
      code,
      (remoteRow: RemoteCoupleRow) => {
        if (!isMounted) return;
        // If the update came from the other partner, sync locally
        if (remoteRow.last_sender_id !== currentUser?.id) {
          if (remoteRow.couple_data) setCouple(remoteRow.couple_data);
          if (remoteRow.house_data) setHouse(remoteRow.house_data);
          if (remoteRow.qa_data) setQA(remoteRow.qa_data);

          if (remoteRow.last_interaction) {
            const int = remoteRow.last_interaction;
            const effectId = 'eff_' + Date.now();
            setFloatingEffects((prev) => [
              ...prev,
              { id: effectId, type: int.type, message: int.message }
            ]);
            if (int.type === 'hug') sound.playHug();
            else if (int.type === 'kiss') sound.playKiss();
            else if (int.type === 'heart_bomb') sound.playReveal();
            else sound.playPop();
          }
        }
      },
      (interactionBroadcast) => {
        if (!isMounted) return;
        if (interactionBroadcast.senderId !== currentUser?.id) {
          const effectId = 'eff_' + Date.now();
          setFloatingEffects((prev) => [
            ...prev,
            { id: effectId, type: interactionBroadcast.type, message: interactionBroadcast.message }
          ]);
          if (interactionBroadcast.type === 'hug') sound.playHug();
          else if (interactionBroadcast.type === 'kiss') sound.playKiss();
          else if (interactionBroadcast.type === 'heart_bomb') sound.playReveal();
          else sound.playPop();
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [pairing.coupleCode, currentUser?.id]);

  // 3. Debounced Auto-Sync of local state updates to Supabase
  useEffect(() => {
    if (!pairing.coupleCode || !isSupabaseConfigured) return;
    const timer = setTimeout(() => {
      syncToRemoteCouple(
        pairing.coupleCode,
        couple,
        house,
        qa,
        currentUser?.id || 'local_user'
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [couple, house, qa, pairing.coupleCode, currentUser?.id]);

  // Sync across tabs locally as well
  useEffect(() => {
    const unsubscribe = subscribeToSync((key) => {
      if (key === 'hazel_couple_state_v1') {
        setCouple(loadStoredData('hazel_couple_state_v1', DEFAULT_COUPLE_STATE));
      } else if (key === 'hazel_house_state_v1') {
        setHouse(loadStoredData('hazel_house_state_v1', DEFAULT_HOUSE_STATE));
      } else if (key === 'hazel_qa_state_v1') {
        setQA(loadStoredData('hazel_qa_state_v1', DEFAULT_QA_STATE));
      }
    });
    return unsubscribe;
  }, []);

  const activePartner = couple.activePartnerId === 'partner1' ? couple.partner1 : couple.partner2;
  const otherPartner = couple.activePartnerId === 'partner1' ? couple.partner2 : couple.partner1;

  const allQuestions = [...DEFAULT_QUESTIONS, ...qa.customQuestions];
  const furnitureCatalog = FURNITURE_CATALOG;

  const loginUser = useCallback((name: string, avatar: string, location: string) => {
    sound.playPop();
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      avatar,
      location,
      timezone: 'GMT+1',
    };
    setCurrentUser(newUser);

    // Iniciar con casita limpia desde cero para construir de a poco
    setCouple(createFreshCoupleState(name, avatar, location));
    setHouse(createFreshHouseState());
    setQA(createFreshQAState());
  }, []);

  const createCoupleInviteCode = useCallback(() => {
    sound.playPop();
    const cleanName = (currentUser?.name || 'LOVE').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'LOVE';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const code = `HAZEL-${cleanName}${randNum}`;

    setPairing({
      coupleCode: code,
      creatorName: currentUser?.name || 'Yo',
      creatorAvatar: currentUser?.avatar || '💖',
      isLinked: false,
    });

    return code;
  }, [currentUser]);

  const joinCoupleByCode = useCallback((code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed.startsWith('HAZEL-') && trimmed.length < 6) return false;

    sound.playReveal();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FF6B8B', '#FFB7B2', '#FFE5D9', '#FFD166'],
    });

    setPairing((prev) => ({
      ...prev,
      coupleCode: trimmed,
      partnerName: prev.partnerName || 'Mi Pareja',
      partnerAvatar: prev.partnerAvatar || '🐻',
      isLinked: true,
      linkedAt: new Date().toISOString(),
    }));

    return true;
  }, []);

  const loginWithExistingCode = useCallback((name: string, avatar: string, location: string, coupleCode: string): boolean => {
    const trimmed = coupleCode.trim().toUpperCase();
    if (!trimmed.startsWith('HAZEL-') || trimmed.length < 6) return false;

    sound.playReveal();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FF6B8B', '#FFB7B2', '#FFE5D9', '#FFD166'],
    });

    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      avatar,
      location,
      timezone: 'GMT+1',
    };
    setCurrentUser(newUser);

    // Estado base limpio antes de hidratar con Supabase
    setCouple(createFreshCoupleState(name, avatar, location));
    setHouse(createFreshHouseState());
    setQA(createFreshQAState());

    setPairing({
      coupleCode: trimmed,
      creatorName: name,
      creatorAvatar: avatar,
      partnerName: 'Mi Pareja',
      partnerAvatar: '🐻',
      isLinked: true,
      linkedAt: new Date().toISOString(),
    });

    return true;
  }, []);

  const logoutUser = useCallback(() => {
    sound.playPop();
    setCurrentUser(null);
    setPairing({
      coupleCode: '',
      creatorName: '',
      creatorAvatar: '',
      isLinked: false,
    });
    setCouple(DEFAULT_COUPLE_STATE);
    setHouse(DEFAULT_HOUSE_STATE);
    setQA(DEFAULT_QA_STATE);
    try {
      localStorage.removeItem('hazel_auth_user_v1');
      localStorage.removeItem('hazel_couple_pairing_v1');
      localStorage.removeItem('hazel_couple_state_v1');
      localStorage.removeItem('hazel_house_state_v1');
      localStorage.removeItem('hazel_qa_state_v1');
    } catch (e) {
      console.error('Error clearing auth storage:', e);
    }
  }, []);

  const startDemoMode = useCallback(() => {
    sound.playReveal();
    setCurrentUser({
      id: 'usr_demo_1',
      name: 'Luna',
      avatar: '🌸',
      location: 'Barcelona, España',
      timezone: 'GMT+2',
    });
    setPairing({
      coupleCode: 'HAZEL-DEMO99',
      creatorName: 'Luna',
      creatorAvatar: '🌸',
      partnerName: 'Mateo',
      partnerAvatar: '🐻',
      isLinked: true,
      linkedAt: new Date().toISOString(),
    });
    setCouple(DEFAULT_COUPLE_STATE);
    setHouse(DEFAULT_HOUSE_STATE);
    setQA(DEFAULT_QA_STATE);
  }, []);

  const toggleMute = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  const switchActivePartner = useCallback((id: PartnerId) => {
    sound.playPop();
    setCouple((prev) => ({
      ...prev,
      activePartnerId: id,
    }));
  }, []);

  const updatePartnerProfile = useCallback((partnerId: PartnerId, updates: Partial<Partner>) => {
    setCouple((prev) => ({
      ...prev,
      [partnerId]: {
        ...prev[partnerId],
        ...updates,
      },
    }));
  }, []);

  const updateMood = useCallback((emoji: string, label: string, energy: number, note: string, color: string) => {
    sound.playPop();
    const activeId = couple.activePartnerId;
    const now = new Date().toISOString();

    setCouple((prev) => {
      const currentPartner = prev[activeId];
      return {
        ...prev,
        [activeId]: {
          ...currentPartner,
          currentMood: {
            emoji,
            label,
            energy,
            note,
            updatedAt: now,
            color,
          },
        },
      };
    });

    // Reward with hearts for sharing mood
    addLoveCoins(10, 'Compartir tu estado de ánimo diario');
  }, [couple.activePartnerId]);

  const addLoveCoins = useCallback((amount: number, reason?: string) => {
    sound.playHeartCollect();
    setCouple((prev) => {
      const newCoins = prev.loveCoins + amount;
      const newExp = prev.experience + amount;
      const expNeeded = prev.level * 300;
      let newLevel = prev.level;
      let remainingExp = newExp;

      if (newExp >= expNeeded) {
        newLevel += 1;
        remainingExp = newExp - expNeeded;
        // Level up celebration!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B8B', '#FFB7B2', '#FFE5D9', '#FFD166', '#88D49E'],
        });
      }

      return {
        ...prev,
        loveCoins: newCoins,
        level: newLevel,
        experience: remainingExp,
      };
    });

    // Visual heart particle
    const effectId = 'effect_' + Date.now() + Math.random();
    setFloatingEffects((prev) => [
      ...prev,
      { id: effectId, type: 'heart_coin', message: `+${amount} Corazones 💕 ${reason ? `(${reason})` : ''}` }
    ]);
  }, []);

  const spendLoveCoins = useCallback((amount: number): boolean => {
    if (couple.loveCoins < amount) return false;
    sound.playPop();
    setCouple((prev) => ({
      ...prev,
      loveCoins: prev.loveCoins - amount,
    }));
    return true;
  }, [couple.loveCoins]);

  const sendInteraction = useCallback((type: InteractionEvent['type'], customMessage?: string) => {
    const activeId = couple.activePartnerId;
    const fromName = couple[activeId].name;
    let defaultMsg = '';

    if (type === 'hug') {
      sound.playHug();
      defaultMsg = `${fromName} te envió un cálido abrazo 🫂`;
    } else if (type === 'kiss') {
      sound.playKiss();
      defaultMsg = `${fromName} te mandó un beso volador 💋`;
    } else if (type === 'poke') {
      sound.playPop();
      defaultMsg = `${fromName} te dio un toquecito: "¡Estoy pensando en ti!" ✨`;
    } else if (type === 'miss_you') {
      sound.playHug();
      defaultMsg = `${fromName} te extraña un montón ahora mismo 🥺💖`;
    } else if (type === 'heart_bomb') {
      sound.playHeartCollect();
      defaultMsg = `¡Lluvia de amor de ${fromName}! 💖✨`;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF6B8B', '#FF8E72', '#FFC9DE'],
      });
    }

    const newEvent: InteractionEvent = {
      id: 'int_' + Date.now(),
      from: activeId,
      type,
      createdAt: new Date().toISOString(),
      message: customMessage || defaultMsg,
    };

    setCouple((prev) => ({
      ...prev,
      recentInteractions: [newEvent, ...prev.recentInteractions.slice(0, 19)],
    }));

    const effectId = 'effect_' + Date.now();
    setFloatingEffects((prev) => [
      ...prev,
      { id: effectId, type, message: customMessage || defaultMsg }
    ]);
  }, [couple]);

  const addLoveNote = useCallback((text: string, sticker?: string) => {
    sound.playHeartCollect();
    const newNote: LoveNote = {
      id: 'note_' + Date.now(),
      from: couple.activePartnerId,
      text,
      sticker: sticker || '💌',
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setCouple((prev) => ({
      ...prev,
      loveNotes: [newNote, ...prev.loveNotes],
    }));

    addLoveCoins(15, 'Nota de amor enviada');
  }, [couple.activePartnerId, addLoveCoins]);

  const updateMeetupDate = useCallback((dateString: string | null) => {
    sound.playPop();
    setCouple((prev) => ({
      ...prev,
      nextMeetupDate: dateString,
    }));
  }, []);

  const changeRoom = useCallback((roomId: RoomId) => {
    sound.playPop();
    setHouse((prev) => ({
      ...prev,
      currentRoomId: roomId,
    }));
  }, []);

  const unlockRoom = useCallback((roomId: RoomId): boolean => {
    const room = house.rooms[roomId];
    if (!room || room.unlocked) return false;
    if (couple.loveCoins < room.unlockCost) return false;

    spendLoveCoins(room.unlockCost);
    sound.playReveal();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });

    const activeId = couple.activePartnerId;
    const log: HouseActivityLog = {
      id: 'act_' + Date.now(),
      partnerId: activeId,
      action: 'room_unlocked',
      itemName: room.name,
      roomName: room.name,
      timestamp: new Date().toISOString(),
      icon: room.icon,
    };

    setHouse((prev) => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          unlocked: true,
        },
      },
      activityLogs: [log, ...prev.activityLogs],
    }));

    return true;
  }, [house.rooms, couple.loveCoins, couple.activePartnerId, couple, spendLoveCoins]);

  const updateRoomTheme = useCallback((roomId: RoomId, wallColor: string, floorType: Room['floorType']) => {
    sound.playPop();
    setHouse((prev) => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          wallColor,
          floorType,
        },
      },
    }));
  }, []);

  const buyFurniture = useCallback((furnitureId: string): boolean => {
    const item = furnitureCatalog.find((f) => f.id === furnitureId);
    if (!item) return false;
    if (house.inventory.includes(furnitureId)) return true; // Already owned
    if (couple.loveCoins < item.price) return false;

    spendLoveCoins(item.price);
    sound.playHeartCollect();

    setHouse((prev) => ({
      ...prev,
      inventory: [...prev.inventory, furnitureId],
    }));

    return true;
  }, [furnitureCatalog, house.inventory, couple.loveCoins, spendLoveCoins]);

  const placeFurniture = useCallback((furnitureId: string, x: number, y: number, targetRoomId?: RoomId) => {
    const item = furnitureCatalog.find((f) => f.id === furnitureId);
    if (!item) return;

    sound.playPlaceItem();
    const rId = targetRoomId || house.currentRoomId;
    const activeId = couple.activePartnerId;
    const roomName = house.rooms[rId]?.name || 'Habitación';

    const newPlacedItem: PlacedFurniture = {
      id: 'placed_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      furnitureId,
      roomId: rId,
      x: Math.max(0, Math.min(8, x)),
      y: Math.max(0, Math.min(6, y)),
      rotation: 0,
      placedBy: activeId,
      placedAt: new Date().toISOString(),
    };

    const log: HouseActivityLog = {
      id: 'act_' + Date.now(),
      partnerId: activeId,
      action: 'placed',
      itemName: item.name,
      roomName,
      timestamp: new Date().toISOString(),
      icon: item.icon,
    };

    setHouse((prev) => ({
      ...prev,
      placedItems: [...prev.placedItems, newPlacedItem],
      activityLogs: [log, ...prev.activityLogs.slice(0, 29)],
    }));
  }, [furnitureCatalog, house.currentRoomId, house.rooms, couple.activePartnerId]);

  const moveFurniture = useCallback((placedId: string, x: number, y: number) => {
    sound.playPop();
    setHouse((prev) => ({
      ...prev,
      placedItems: prev.placedItems.map((item) =>
        item.id === placedId
          ? { ...item, x: Math.max(0, Math.min(8, x)), y: Math.max(0, Math.min(6, y)) }
          : item
      ),
    }));
  }, []);

  const rotateFurniture = useCallback((placedId: string) => {
    sound.playPop();
    setHouse((prev) => ({
      ...prev,
      placedItems: prev.placedItems.map((item) => {
        if (item.id !== placedId) return item;
        const nextRotation = ((item.rotation + 90) % 360) as 0 | 90 | 180 | 270;
        return { ...item, rotation: nextRotation };
      }),
    }));
  }, []);

  const changeFurnitureLayer = useCallback((placedId: string, delta: number) => {
    sound.playPop();
    setHouse((prev) => ({
      ...prev,
      placedItems: prev.placedItems.map((item) => {
        if (item.id !== placedId) return item;
        const currentLayer = item.layer || 0;
        const nextLayer = Math.max(-5, Math.min(5, currentLayer + delta));
        return { ...item, layer: nextLayer };
      }),
    }));
  }, []);

  const removeFurniture = useCallback((placedId: string) => {
    sound.playPop();
    setHouse((prev) => ({
      ...prev,
      placedItems: prev.placedItems.filter((item) => item.id !== placedId),
    }));
  }, []);

  const setCustomPhotoOnFrame = useCallback((placedId: string, photoUrl: string, note?: string) => {
    sound.playHeartCollect();
    setHouse((prev) => ({
      ...prev,
      placedItems: prev.placedItems.map((item) =>
        item.id === placedId
          ? { ...item, customPhotoUrl: photoUrl, customNote: note || item.customNote }
          : item
      ),
    }));
  }, []);

  const interactWithFurniture = useCallback((placedId: string) => {
    const placed = house.placedItems.find((p) => p.id === placedId);
    if (!placed) return;
    const meta = furnitureCatalog.find((f) => f.id === placed.furnitureId);
    if (!meta) return;

    if (meta.specialAction === 'purr') {
      sound.playHug();
      setFloatingEffects((prev) => [
        ...prev,
        { id: 'pet_' + Date.now(), type: 'hug', message: `${meta.name} ronronea y te da cariño 🐾💖` }
      ]);
    } else if (meta.specialAction === 'turn_on_light') {
      sound.playPop();
      setHouse((prev) => ({
        ...prev,
        placedItems: prev.placedItems.map((it) =>
          it.id === placedId ? { ...it, state: { ...it.state, isOn: !it.state?.isOn } } : it
        ),
      }));
    } else if (meta.specialAction === 'water_plant') {
      sound.playHeartCollect();
      setFloatingEffects((prev) => [
        ...prev,
        { id: 'plant_' + Date.now(), type: 'heart_coin', message: `¡Regaste a ${meta.name}! Crece fuerte con su amor 🌱💧` }
      ]);
    } else if (meta.specialAction === 'play_music') {
      sound.playReveal();
      setFloatingEffects((prev) => [
        ...prev,
        { id: 'music_' + Date.now(), type: 'heart_bomb', message: `🎶 Sonando su canción favorita en el tocadiscos...` }
      ]);
    } else if (meta.specialAction === 'make_coffee') {
      sound.playHeartCollect();
      setFloatingEffects((prev) => [
        ...prev,
        { id: 'coffee_' + Date.now(), type: 'heart_coin', message: `☕ Preparando café caliente y cremoso para los dos...` }
      ]);
    } else if (meta.specialAction === 'diffuse_aroma') {
      sound.playHug();
      setFloatingEffects((prev) => [
        ...prev,
        { id: 'aroma_' + Date.now(), type: 'kiss', message: `🌸 Difusor encendido: aroma a lavanda y vainilla dulce...` }
      ]);
    } else {
      sound.playPop();
    }
  }, [house.placedItems, furnitureCatalog]);

  const submitAnswer = useCallback((questionId: string, text: string) => {
    const activeId = couple.activePartnerId;
    const now = new Date().toISOString();
    const existingRecord = qa.records[questionId] || {
      id: 'ans_' + Date.now(),
      questionId,
      isRevealed: false,
      reactions: {},
      rewardClaimed: false,
    };

    const isPartner1 = activeId === 'partner1';
    const updatedRecord: QuestionAnswerRecord = {
      ...existingRecord,
      partner1Answer: isPartner1 ? text : existingRecord.partner1Answer,
      partner1AnsweredAt: isPartner1 ? now : existingRecord.partner1AnsweredAt,
      partner2Answer: !isPartner1 ? text : existingRecord.partner2Answer,
      partner2AnsweredAt: !isPartner1 ? now : existingRecord.partner2AnsweredAt,
    };

    // Check if BOTH partners have answered now!
    const bothAnswered = !!(updatedRecord.partner1Answer && updatedRecord.partner2Answer);
    if (bothAnswered && !updatedRecord.isRevealed) {
      updatedRecord.isRevealed = true;
      updatedRecord.revealedAt = now;
      sound.playReveal();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FF6B8B', '#FFB7B2', '#FFE5D9', '#FFD166'],
      });

      // Find question hearts reward
      const questionMeta = allQuestions.find((q) => q.id === questionId);
      const hearts = questionMeta?.rewardHearts || 30;
      addLoveCoins(hearts, `¡Ambos respondieron: "${questionMeta?.title || 'Pregunta'}"!`);
      updatedRecord.rewardClaimed = true;
    } else {
      sound.playPop();
    }

    setQA((prev) => ({
      ...prev,
      records: {
        ...prev.records,
        [questionId]: updatedRecord,
      },
    }));
  }, [couple.activePartnerId, qa.records, allQuestions, addLoveCoins]);

  const addReactionToAnswer = useCallback((questionId: string, emoji: string) => {
    sound.playHeartCollect();
    const activeId = couple.activePartnerId;
    setQA((prev) => {
      const record = prev.records[questionId];
      if (!record) return prev;
      return {
        ...prev,
        records: {
          ...prev.records,
          [questionId]: {
            ...record,
            reactions: {
              ...record.reactions,
              [activeId === 'partner1' ? 'partner1Emoji' : 'partner2Emoji']: emoji,
            },
          },
        },
      };
    });
  }, [couple.activePartnerId]);

  const createCustomQuestion = useCallback((title: string, prompt: string, category: QuestionCategory = 'custom') => {
    sound.playHeartCollect();
    const activeId = couple.activePartnerId;
    const authorName = couple[activeId].name;

    const newQuestion: Question = {
      id: 'custom_' + Date.now(),
      category,
      categoryLabel: `Pregunta de ${authorName}`,
      categoryEmoji: '💌',
      accentColor: '#FF8E72',
      title,
      prompt,
      isCustom: true,
      createdBy: activeId,
      rewardHearts: 35,
    };

    setQA((prev) => ({
      ...prev,
      customQuestions: [newQuestion, ...prev.customQuestions],
    }));

    addLoveCoins(15, 'Crear pregunta personalizada');
  }, [couple, addLoveCoins]);

  const setDailyQuestion = useCallback((questionId: string) => {
    sound.playPop();
    setQA((prev) => ({
      ...prev,
      dailyQuestionId: questionId,
    }));
  }, []);

  const dismissEffect = useCallback((id: string) => {
    setFloatingEffects((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <CoupleContext.Provider
      value={{
        couple,
        house,
        qa,
        activePartner,
        otherPartner,
        allQuestions,
        furnitureCatalog,
        floatingEffects,
        isMuted,
        toggleMute,
        currentUser,
        pairing,
        loginUser,
        loginWithExistingCode,
        createCoupleInviteCode,
        joinCoupleByCode,
        logoutUser,
        startDemoMode,
        switchActivePartner,
        updatePartnerProfile,
        updateMood,
        sendInteraction,
        addLoveNote,
        updateMeetupDate,
        addLoveCoins,
        spendLoveCoins,
        changeRoom,
        unlockRoom,
        updateRoomTheme,
        buyFurniture,
        placeFurniture,
        moveFurniture,
        rotateFurniture,
        changeFurnitureLayer,
        removeFurniture,
        setCustomPhotoOnFrame,
        interactWithFurniture,
        submitAnswer,
        addReactionToAnswer,
        createCustomQuestion,
        setDailyQuestion,
        dismissEffect,
      }}
    >
      {children}
    </CoupleContext.Provider>
  );
};

export const useCouple = () => {
  const context = useContext(CoupleContext);
  if (!context) {
    throw new Error('useCouple must be used within a CoupleProvider');
  }
  return context;
};
