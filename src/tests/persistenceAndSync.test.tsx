import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CoupleProvider, useCouple } from '../context/CoupleContext';
import { loadStoredData } from '../utils/storage';
import { HouseState } from '../types/house';
import { CoupleState } from '../types/couple';
import { QAState } from '../types/qa';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CoupleProvider>{children}</CoupleProvider>
);

describe('Hazel Full End-to-End Persistence & Data Integrity Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('1. Verifies that creating a fresh house starts clean and persists in localStorage', () => {
    const { result, unmount } = renderHook(() => useCouple(), { wrapper });

    // Step A: Register new couple
    act(() => {
      result.current.loginUser('Pedro', '🦊', 'Santiago, Chile');
      result.current.createCoupleInviteCode();
    });

    const createdCode = result.current.pairing.coupleCode;
    expect(createdCode).toMatch(/^HAZEL-/);
    expect(result.current.currentUser?.name).toBe('Pedro');

    // Step B: Enter created room
    act(() => {
      result.current.joinCoupleByCode(createdCode);
    });

    expect(result.current.pairing.isLinked).toBe(true);

    // Step C: Verify fresh start metrics
    expect(result.current.couple.streakDays).toBe(1);
    expect(result.current.couple.loveCoins).toBe(100);
    expect(result.current.house.placedItems).toHaveLength(0); // Clean empty room
    expect(result.current.house.inventory).toContain('rug_heart_pink'); // Welcome gift
    expect(Object.keys(result.current.qa.records)).toHaveLength(0);

    // Step D: Verify that localStorage actually saved the pairing and user
    const savedUser = loadStoredData<any>('hazel_auth_user_v1', null);
    const savedPairing = loadStoredData<any>('hazel_couple_pairing_v1', null);

    expect(savedUser).not.toBeNull();
    expect(savedUser.name).toBe('Pedro');
    expect(savedPairing.coupleCode).toBe(createdCode);
    expect(savedPairing.isLinked).toBe(true);

    unmount();
  });

  it('2. Verifies that furniture placement, movement, and rotation are completely saved across reloads', () => {
    // Session 1: User decorates the house
    const session1 = renderHook(() => useCouple(), { wrapper });

    act(() => {
      session1.result.current.loginWithExistingCode('Pedro', '🦊', 'Santiago', 'HAZEL-PEDR9999');
    });

    // Place a sofa from store/inventory
    act(() => {
      session1.result.current.placeFurniture('sofa_cloud_pink', 3, 2);
    });

    const placedItems = session1.result.current.house.placedItems;
    expect(placedItems).toHaveLength(1);
    const placedItem = placedItems[0];
    expect(placedItem.furnitureId).toBe('sofa_cloud_pink');
    expect(placedItem.x).toBe(3);
    expect(placedItem.y).toBe(2);

    // Move furniture to (5, 4) and rotate
    act(() => {
      session1.result.current.moveFurniture(placedItem.id, 5, 4);
      session1.result.current.rotateFurniture(placedItem.id);
    });

    const updatedItem = session1.result.current.house.placedItems[0];
    expect(updatedItem.x).toBe(5);
    expect(updatedItem.y).toBe(4);
    expect(updatedItem.rotation).toBe(90);

    // Verify written to localStorage
    const storedHouse = loadStoredData<HouseState | null>('hazel_house_state_v1', null);
    expect(storedHouse).not.toBeNull();
    expect(storedHouse?.placedItems).toHaveLength(1);
    expect(storedHouse?.placedItems[0].x).toBe(5);
    expect(storedHouse?.placedItems[0].y).toBe(4);
    expect(storedHouse?.placedItems[0].rotation).toBe(90);

    session1.unmount();

    // Session 2: User reopens the app / refreshes the page
    const session2 = renderHook(() => useCouple(), { wrapper });

    expect(session2.result.current.currentUser?.name).toBe('Pedro');
    expect(session2.result.current.pairing.coupleCode).toBe('HAZEL-PEDR9999');
    expect(session2.result.current.house.placedItems).toHaveLength(1);

    const reloadedFurniture = session2.result.current.house.placedItems[0];
    expect(reloadedFurniture.furnitureId).toBe('sofa_cloud_pink');
    expect(reloadedFurniture.x).toBe(5);
    expect(reloadedFurniture.y).toBe(4);
    expect(reloadedFurniture.rotation).toBe(90);

    session2.unmount();
  });

  it('3. Verifies that QA answers, coins, mood, and love notes are completely persisted across reloads', () => {
    // Session 1: Answering and noting
    const session1 = renderHook(() => useCouple(), { wrapper });

    act(() => {
      session1.result.current.loginWithExistingCode('Pedro', '🌸', 'Santiago', 'HAZEL-PEDR9999');
    });

    const initialCoins = session1.result.current.couple.loveCoins;

    // A. Update mood
    act(() => {
      session1.result.current.updateMood('🥰', 'En las nubes contigo', 95, 'Feliz por nuestra casita', '#FFB7B2');
    });

    // B. Send a love note
    act(() => {
      session1.result.current.addLoveNote('¡Hola mi amor! Te amo con todo mi corazón.', '💌');
    });

    // C. Answer daily question
    act(() => {
      session1.result.current.submitAnswer('q_intimacy_1', 'La primera vez que tomamos café juntos bajo la lluvia.');
    });

    // D. Earn coins
    act(() => {
      session1.result.current.addLoveCoins(50, 'Regalo especial');
    });

    expect(session1.result.current.couple.loveCoins).toBe(initialCoins + 50 + 25);
    expect(session1.result.current.couple.loveNotes).toHaveLength(1);
    expect(session1.result.current.couple.loveNotes[0].text).toContain('Te amo con todo mi corazón');
    expect(session1.result.current.qa.records['q_intimacy_1'].partner1Answer).toContain('café juntos');

    session1.unmount();

    // Session 2: Reload and verify all data persists
    const session2 = renderHook(() => useCouple(), { wrapper });

    // Verify Mood
    const partner1Mood = session2.result.current.couple.partner1.currentMood;
    expect(partner1Mood.emoji).toBe('🥰');
    expect(partner1Mood.label).toBe('En las nubes contigo');
    expect(partner1Mood.energy).toBe(95);

    // Verify Love Notes
    expect(session2.result.current.couple.loveNotes).toHaveLength(1);
    expect(session2.result.current.couple.loveNotes[0].text).toBe('¡Hola mi amor! Te amo con todo mi corazón.');

    // Verify Coins
    expect(session2.result.current.couple.loveCoins).toBe(initialCoins + 50 + 25);

    // Verify QA Answer
    expect(session2.result.current.qa.records['q_intimacy_1']).toBeDefined();
    expect(session2.result.current.qa.records['q_intimacy_1'].partner1Answer).toBe(
      'La primera vez que tomamos café juntos bajo la lluvia.'
    );

    session2.unmount();
  });

  it('4. Verifies that logout completely purges local storage and protects session privacy', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    act(() => {
      result.current.loginWithExistingCode('Pedro', '🦊', 'Santiago', 'HAZEL-PEDR9999');
      result.current.placeFurniture('sofa_cloud_pink', 2, 2);
    });

    expect(result.current.currentUser).not.toBeNull();
    expect(result.current.pairing.isLinked).toBe(true);

    // Logout
    act(() => {
      result.current.logoutUser();
    });

    // Assert Context state is reset
    expect(result.current.currentUser).toBeNull();
    expect(result.current.pairing.isLinked).toBe(false);
    expect(result.current.pairing.coupleCode).toBe('');

    // Assert LocalStorage auth is wiped and pairing is unlinked
    expect(localStorage.getItem('hazel_auth_user_v1')).toBeNull();
    const storedPairing = JSON.parse(localStorage.getItem('hazel_couple_pairing_v1') || '{}');
    expect(storedPairing.isLinked).toBe(false);
  });

  it('5. Verifies conflict-free merging when both partners interact with the same house simultaneously', async () => {
    const { mergeHouseState, mergeCoupleState, mergeQAState } = await import('../utils/supabaseSync');

    // 1. Concurrent Furniture Movement / Placement
    const now = Date.now();
    const { DEFAULT_ROOMS } = await import('../data/defaultFurniture');
    const baseHouse: HouseState = {
      currentRoomId: 'living_room',
      inventory: ['sofa_cloud_pink', 'table_wood_round'],
      rooms: DEFAULT_ROOMS,
      placedItems: [
        { id: 'item_sofa', furnitureId: 'sofa_cloud_pink', roomId: 'living_room', x: 2, y: 2, rotation: 0, placedBy: 'partner1', placedAt: new Date(now - 10000).toISOString() },
        { id: 'item_table', furnitureId: 'table_wood_round', roomId: 'living_room', x: 5, y: 5, rotation: 0, placedBy: 'partner2', placedAt: new Date(now - 10000).toISOString() },
      ],
      activityLogs: [],
    };

    // Partner 1 moved the sofa to (3, 3) at now - 2000
    const partner1House: HouseState = {
      ...baseHouse,
      placedItems: [
        { id: 'item_sofa', furnitureId: 'sofa_cloud_pink', roomId: 'living_room', x: 3, y: 3, rotation: 0, placedBy: 'partner1', placedAt: new Date(now - 2000).toISOString() },
        baseHouse.placedItems[1],
      ],
    };

    // Partner 2 simultaneously moved the table to (6, 6) at now - 1000
    const partner2House: HouseState = {
      ...baseHouse,
      placedItems: [
        baseHouse.placedItems[0],
        { id: 'item_table', furnitureId: 'table_wood_round', roomId: 'living_room', x: 6, y: 6, rotation: 90, placedBy: 'partner2', placedAt: new Date(now - 1000).toISOString() },
      ],
    };

    // When Partner 1 receives Partner 2's remote update, it merges:
    const mergedHouse = mergeHouseState(partner1House, partner2House);

    const mergedSofa = mergedHouse.placedItems.find((p) => p.id === 'item_sofa');
    const mergedTable = mergedHouse.placedItems.find((p) => p.id === 'item_table');

    // Sofa stayed at (3, 3) (Partner 1's newer position), Table updated to (6, 6) (Partner 2's newer position)! Neither reverted!
    expect(mergedSofa?.x).toBe(3);
    expect(mergedSofa?.y).toBe(3);
    expect(mergedTable?.x).toBe(6);
    expect(mergedTable?.y).toBe(6);
    expect(mergedTable?.rotation).toBe(90);

    // 2. Concurrent Q&A Answers
    const p1QA: QAState = {
      dailyQuestionId: 'q_love_1',
      activeDeckCategory: 'intimacy',
      records: {
        q_love_1: {
          id: 'rec_1',
          questionId: 'q_love_1',
          partner1Answer: 'Respuesta de Luna 🦊',
          partner1AnsweredAt: new Date(now - 3000).toISOString(),
          isRevealed: false,
          reactions: {},
          rewardClaimed: false,
        }
      },
      customQuestions: [],
    };

    const p2QA: QAState = {
      dailyQuestionId: 'q_love_1',
      activeDeckCategory: 'intimacy',
      records: {
        q_love_1: {
          id: 'rec_1',
          questionId: 'q_love_1',
          partner2Answer: 'Respuesta de Mateo 🐨',
          partner2AnsweredAt: new Date(now - 1000).toISOString(),
          isRevealed: false,
          reactions: {},
          rewardClaimed: false,
        }
      },
      customQuestions: [],
    };

    const mergedQA = mergeQAState(p1QA, p2QA, 'partner1');
    const rec = mergedQA.records['q_love_1'];
    expect(rec.partner1Answer).toBe('Respuesta de Luna 🦊');
    expect(rec.partner2Answer).toBe('Respuesta de Mateo 🐨');
    expect(rec.isRevealed).toBe(true); // Both answered -> automatically revealed!
  });
});
