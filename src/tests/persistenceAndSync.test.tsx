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
});
