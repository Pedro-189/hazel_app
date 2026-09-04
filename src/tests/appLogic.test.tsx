import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CoupleProvider, useCouple } from '../context/CoupleContext';
import { generateInfiniteQuestion } from '../utils/questionGenerator';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CoupleProvider>{children}</CoupleProvider>
);

describe('Hazel Couple App Logic & State Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default couple, rooms, and over 100 questions', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    expect(result.current.couple.partner1.name).toBe('Luna');
    expect(result.current.couple.partner2.name).toBe('Mateo');
    expect(result.current.couple.activePartnerId).toBe('partner1');
    expect(result.current.couple.loveCoins).toBeGreaterThan(0);
    expect(result.current.allQuestions.length).toBeGreaterThanOrEqual(100);
    expect(result.current.house.rooms.living_room.unlocked).toBe(true);
  });

  it('should initialize with null currentUser and unlinked pairing when storage is clear', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    expect(result.current.currentUser).toBeNull();
    expect(result.current.pairing.isLinked).toBe(false);
  });

  it('should support direct login with existing couple code', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    let success = false;
    act(() => {
      success = result.current.loginWithExistingCode('Carlos', '🐻', 'Valencia, España', 'HAZEL-CARL1234');
    });

    expect(success).toBe(true);
    expect(result.current.currentUser?.name).toBe('Carlos');
    expect(result.current.currentUser?.avatar).toBe('🐻');
    expect(result.current.pairing.coupleCode).toBe('HAZEL-CARL1234');
    expect(result.current.pairing.isLinked).toBe(true);
  });

  it('should allow user to log out and clear session cleanly', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    act(() => {
      result.current.loginWithExistingCode('Carlos', '🐻', 'Valencia, España', 'HAZEL-CARL1234');
    });
    expect(result.current.currentUser).not.toBeNull();
    expect(result.current.pairing.isLinked).toBe(true);

    act(() => {
      result.current.logoutUser();
    });

    expect(result.current.currentUser).toBeNull();
    expect(result.current.pairing.isLinked).toBe(false);
    expect(result.current.pairing.coupleCode).toBe('');
  });

  it('should activate demo mode with Luna and Mateo', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    act(() => {
      result.current.startDemoMode();
    });

    expect(result.current.currentUser?.name).toBe('Luna');
    expect(result.current.pairing.isLinked).toBe(true);
    expect(result.current.pairing.coupleCode).toBe('HAZEL-DEMO99');
  });

  it('should support login and couple invite code pairing flow', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    // Step 1: Login user
    act(() => {
      result.current.loginUser('Sofia', '🦊', 'Sevilla, España');
    });

    expect(result.current.currentUser?.name).toBe('Sofia');
    expect(result.current.currentUser?.avatar).toBe('🦊');

    // Step 2: Create invite code
    let code = '';
    act(() => {
      code = result.current.createCoupleInviteCode();
    });

    expect(code).toMatch(/^HAZEL-/);
    expect(result.current.pairing.coupleCode).toBe(code);

    // Step 3: Join couple code
    act(() => {
      const success = result.current.joinCoupleByCode(code);
      expect(success).toBe(true);
    });

    expect(result.current.pairing.isLinked).toBe(true);
  });

  it('should start brand new houses from scratch with empty rooms and welcome gifts', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    act(() => {
      result.current.loginUser('Elena', '🌸', 'Madrid, España');
    });

    expect(result.current.couple.streakDays).toBe(1);
    expect(result.current.couple.loveCoins).toBe(100);
    expect(result.current.couple.loveNotes).toHaveLength(0);
    expect(result.current.house.placedItems).toHaveLength(0);
    expect(result.current.house.inventory).toContain('rug_heart_pink');
    expect(Object.keys(result.current.qa.records)).toHaveLength(0);
  });

  it('should switch active partner perspective seamlessly', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    expect(result.current.activePartner.name).toBe('Luna');

    act(() => {
      result.current.switchActivePartner('partner2');
    });

    expect(result.current.activePartner.name).toBe('Mateo');
    expect(result.current.otherPartner.name).toBe('Luna');
  });

  it('should handle blind QA submission and trigger reveal when both answer', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });
    const targetQId = 'q_spicy_1';
    const initialCoins = result.current.couple.loveCoins;

    // Step 1: Luna (partner1) answers
    act(() => {
      result.current.switchActivePartner('partner1');
    });
    act(() => {
      result.current.submitAnswer(targetQId, 'Aquel beso en el mirador al atardecer bajo la lluvia.');
    });

    const recordStep1 = result.current.qa.records[targetQId];
    expect(recordStep1.partner1Answer).toBe('Aquel beso en el mirador al atardecer bajo la lluvia.');
    expect(recordStep1.partner2Answer).toBeUndefined();
    expect(recordStep1.isRevealed).toBe(false);

    // Step 2: Mateo (partner2) answers the same question
    act(() => {
      result.current.switchActivePartner('partner2');
    });
    act(() => {
      result.current.submitAnswer(targetQId, 'Cuando nos despedimos antes de subir al avión.');
    });

    const recordStep2 = result.current.qa.records[targetQId];
    expect(recordStep2.partner2Answer).toBe('Cuando nos despedimos antes de subir al avión.');
    expect(recordStep2.isRevealed).toBe(true);
    expect(result.current.couple.loveCoins).toBeGreaterThan(initialCoins);
  });

  it('should generate infinite questions based on tones', () => {
    const qRomance = generateInfiniteQuestion('romance');
    expect(qRomance.prompt).toBeDefined();
    expect(qRomance.category).toBe('intimacy');

    const qSpicy = generateInfiniteQuestion('spicy');
    expect(qSpicy.prompt).toBeDefined();
    expect(qSpicy.category).toBe('spicy');

    const qFuture = generateInfiniteQuestion('future');
    expect(qFuture.prompt).toBeDefined();
    expect(qFuture.category).toBe('dreams');
  });

  it('should update daily mood and battery energy', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    act(() => {
      result.current.switchActivePartner('partner1');
      result.current.updateMood('🥰', 'Muy Enamorada', 95, 'Tomando mate pensando en ti', '#FFB7B2');
    });

    expect(result.current.couple.partner1.currentMood.emoji).toBe('🥰');
    expect(result.current.couple.partner1.currentMood.label).toBe('Muy Enamorada');
    expect(result.current.couple.partner1.currentMood.energy).toBe(95);
    expect(result.current.couple.partner1.currentMood.note).toBe('Tomando mate pensando en ti');
  });

  it('should handle precision furniture movement, rotation and layering', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    act(() => {
      result.current.placeFurniture('sofa_cloud_pink', 2, 4);
    });

    const placedItem = result.current.house.placedItems.find(
      p => p.furnitureId === 'sofa_cloud_pink' && p.x === 2 && p.y === 4
    );
    expect(placedItem).toBeDefined();

    if (placedItem) {
      // Move furniture
      act(() => {
        result.current.moveFurniture(placedItem.id, 5, 2);
      });
      const movedItem = result.current.house.placedItems.find(p => p.id === placedItem.id);
      expect(movedItem?.x).toBe(5);
      expect(movedItem?.y).toBe(2);

      // Adjust layer (Z-index offset)
      act(() => {
        result.current.changeFurnitureLayer(placedItem.id, 2);
      });
      const layeredItem = result.current.house.placedItems.find(p => p.id === placedItem.id);
      expect(layeredItem?.layer).toBe(2);

      // Rotate furniture
      act(() => {
        result.current.rotateFurniture(placedItem.id);
      });
      const rotatedItem = result.current.house.placedItems.find(p => p.id === placedItem.id);
      expect(rotatedItem?.rotation).toBe(90);
    }
  });

  it('should unlock rooms when couple has enough love hearts', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    act(() => {
      result.current.addLoveCoins(500, 'Test reward');
    });

    expect(result.current.house.rooms.kitchen.unlocked).toBe(false);

    act(() => {
      result.current.unlockRoom('kitchen');
    });

    expect(result.current.house.rooms.kitchen.unlocked).toBe(true);
  });

  it('should customize room wallpaper and floor theme', () => {
    const { result } = renderHook(() => useCouple(), { wrapper });

    act(() => {
      result.current.updateRoomTheme('living_room', '#FFEBE8', 'carpet');
    });

    expect(result.current.house.rooms.living_room.wallColor).toBe('#FFEBE8');
    expect(result.current.house.rooms.living_room.floorType).toBe('carpet');
  });
});
