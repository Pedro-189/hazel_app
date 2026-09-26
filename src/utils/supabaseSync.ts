import { supabase, isSupabaseConfigured } from './supabaseClient';
import { CoupleState, PartnerId, LoveNote, InteractionEvent } from '../types/couple';
import { HouseState, RoomId, PlacedFurniture, HouseActivityLog } from '../types/house';
import { QAState, Question, QuestionAnswerRecord } from '../types/qa';

export interface RemoteCoupleRow {
  id: string; // coupleCode
  couple_data: CoupleState;
  house_data: HouseState;
  qa_data: QAState;
  last_interaction?: any;
  last_sender_id?: string;
  updated_at: string;
}

export const fetchRemoteCouple = async (coupleCode: string): Promise<RemoteCoupleRow | null> => {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('hazel_couples')
      .select('*')
      .eq('id', coupleCode.toUpperCase())
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Not found is normal for new codes
        console.warn('Error fetching remote couple from Supabase:', error.message);
      }
      return null;
    }

    return data as RemoteCoupleRow;
  } catch (err) {
    console.error('Unexpected error fetching from Supabase:', err);
    return null;
  }
};

export const syncToRemoteCouple = async (
  coupleCode: string,
  coupleData: CoupleState,
  houseData: HouseState,
  qaData: QAState,
  senderId: string,
  lastInteraction?: any
): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase || !coupleCode) return false;

  try {
    const row: Partial<RemoteCoupleRow> = {
      id: coupleCode.toUpperCase(),
      couple_data: coupleData,
      house_data: houseData,
      qa_data: qaData,
      last_sender_id: senderId,
      updated_at: new Date().toISOString(),
    };

    if (lastInteraction) {
      row.last_interaction = lastInteraction;
    }

    const { error } = await supabase
      .from('hazel_couples')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Error upserting to Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error upserting to Supabase:', err);
    return false;
  }
};

export const subscribeToRemoteCouple = (
  coupleCode: string,
  onRemoteUpdate: (row: RemoteCoupleRow) => void,
  onBroadcastInteraction?: (interaction: any) => void
) => {
  if (!isSupabaseConfigured || !supabase || !coupleCode) {
    return () => {};
  }

  const cleanCode = coupleCode.toUpperCase();
  const channelName = `hazel_room_${cleanCode}`;

  const channel = supabase
    .channel(channelName)
    // 1. Listen for database updates (furniture placed, questions answered, mood updated)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'hazel_couples',
        filter: `id=eq.${cleanCode}`,
      },
      (payload) => {
        if (payload.new) {
          onRemoteUpdate(payload.new as RemoteCoupleRow);
        }
      }
    )
    // 2. Listen for fast realtime broadcasts (hugs, kisses, confetti)
    .on('broadcast', { event: 'INTERACTION' }, (payload) => {
      if (payload.payload && onBroadcastInteraction) {
        onBroadcastInteraction(payload.payload);
      }
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`[Supabase Realtime] Conectado a la casita: ${cleanCode}`);
      }
    });

  return () => {
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
};

export const broadcastFastInteraction = (coupleCode: string, interactionData: any) => {
  if (!isSupabaseConfigured || !supabase || !coupleCode) return;

  const channelName = `hazel_room_${coupleCode.toUpperCase()}`;
  supabase.channel(channelName).send({
    type: 'broadcast',
    event: 'INTERACTION',
    payload: interactionData,
  });
};

/**
 * Merges local and remote CoupleState without reverting either partner's data.
 */
export const mergeCoupleState = (
  local: CoupleState,
  remote: CoupleState,
  myRole: PartnerId
): CoupleState => {
  if (!remote || !remote.partner1) return local;

  const isP1 = myRole === 'partner1';

  // Preserve local partner's latest status/mood, take remote for other partner
  const mergedPartner1 = isP1
    ? {
        ...local.partner1,
        pin: local.partner1.pin || remote.partner1?.pin || '',
      }
    : (remote.partner1 || local.partner1);

  const mergedPartner2 = !isP1
    ? {
        ...local.partner2,
        pin: local.partner2.pin || remote.partner2?.pin || '',
      }
    : (remote.partner2 || local.partner2);

  // Merge love notes by ID (union, newest first)
  const noteMap = new Map<string, LoveNote>();
  (local.loveNotes || []).forEach((n) => noteMap.set(n.id, n));
  (remote.loveNotes || []).forEach((n) => noteMap.set(n.id, n));
  const mergedNotes = Array.from(noteMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Merge recent interactions
  const intMap = new Map<string, InteractionEvent>();
  (local.recentInteractions || []).forEach((i) => intMap.set(i.id, i));
  (remote.recentInteractions || []).forEach((i) => intMap.set(i.id, i));
  const mergedInteractions = Array.from(intMap.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return {
    ...remote,
    activePartnerId: myRole,
    partner1: mergedPartner1,
    partner2: mergedPartner2,
    loveCoins: Math.max(local.loveCoins || 0, remote.loveCoins || 0),
    streakDays: Math.max(local.streakDays || 1, remote.streakDays || 1),
    level: Math.max(local.level || 1, remote.level || 1),
    experience: Math.max(local.experience || 0, remote.experience || 0),
    loveNotes: mergedNotes,
    recentInteractions: mergedInteractions,
  };
};

/**
 * Merges local and remote HouseState without reverting furniture movement or placement.
 */
export const mergeHouseState = (
  local: HouseState,
  remote: HouseState,
  recentlyDeletedIds?: Set<string>
): HouseState => {
  if (!remote || !remote.rooms) return local;

  // Merge inventory: union of unique furniture IDs
  const inventorySet = new Set([...(local.inventory || []), ...(remote.inventory || [])]);

  // Merge unlocked rooms
  const mergedRooms = { ...local.rooms };
  if (remote.rooms) {
    Object.entries(remote.rooms).forEach(([rId, rData]) => {
      const typedId = rId as RoomId;
      if (mergedRooms[typedId]) {
        mergedRooms[typedId] = {
          ...mergedRooms[typedId],
          ...rData,
          unlocked: Boolean(mergedRooms[typedId].unlocked || rData.unlocked),
        };
      }
    });
  }

  // Merge placed furniture by item.id using last-write timestamp comparison
  const remoteItems = remote.placedItems || [];
  const localItems = local.placedItems || [];

  const itemMap = new Map<string, PlacedFurniture>();
  // Start with remote items, omitting any that were recently deleted locally
  remoteItems.forEach((item) => {
    if (!recentlyDeletedIds || !recentlyDeletedIds.has(item.id)) {
      itemMap.set(item.id, item);
    }
  });

  // Compare with local items
  const tenSecondsAgo = new Date(Date.now() - 10000).toISOString();
  localItems.forEach((localItem) => {
    const remoteItem = itemMap.get(localItem.id);
    if (!remoteItem) {
      // Local has an item not yet in remote. If placed recently, keep it.
      if (!localItem.placedAt || localItem.placedAt > tenSecondsAgo) {
        itemMap.set(localItem.id, localItem);
      }
    } else {
      // Both have the item: check which one has a more recent placedAt / updatedAt
      const localTime = new Date(localItem.placedAt || 0).getTime();
      const remoteTime = new Date(remoteItem.placedAt || 0).getTime();
      if (localTime >= remoteTime) {
        itemMap.set(localItem.id, localItem);
      }
    }
  });

  // Merge activity logs
  const logMap = new Map<string, HouseActivityLog>();
  (local.activityLogs || []).forEach((l) => logMap.set(l.id, l));
  (remote.activityLogs || []).forEach((l) => logMap.set(l.id, l));
  const mergedLogs = Array.from(logMap.values())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 30);

  return {
    ...remote,
    currentRoomId: local.currentRoomId, // Preserve user's current room view
    rooms: mergedRooms,
    inventory: Array.from(inventorySet),
    placedItems: Array.from(itemMap.values()),
    activityLogs: mergedLogs,
  };
};

/**
 * Merges local and remote QAState without overwriting either partner's answers.
 */
export const mergeQAState = (
  local: QAState,
  remote: QAState,
  myRole: PartnerId
): QAState => {
  if (!remote || !remote.records) return local;

  const mergedRecords: Record<string, QuestionAnswerRecord> = {
    ...(local.records || {}),
  };

  Object.entries(remote.records).forEach(([qId, remoteRec]) => {
    const localRec = mergedRecords[qId];
    if (!localRec) {
      mergedRecords[qId] = remoteRec;
    } else {
      const isP1 = myRole === 'partner1';
      const p1Ans = isP1
        ? (localRec.partner1Answer || remoteRec.partner1Answer)
        : (remoteRec.partner1Answer || localRec.partner1Answer);
      const p1Time = isP1
        ? (localRec.partner1AnsweredAt || remoteRec.partner1AnsweredAt)
        : (remoteRec.partner1AnsweredAt || localRec.partner1AnsweredAt);

      const p2Ans = !isP1
        ? (localRec.partner2Answer || remoteRec.partner2Answer)
        : (remoteRec.partner2Answer || localRec.partner2Answer);
      const p2Time = !isP1
        ? (localRec.partner2AnsweredAt || remoteRec.partner2AnsweredAt)
        : (remoteRec.partner2AnsweredAt || localRec.partner2AnsweredAt);

      const bothAnswered = Boolean(p1Ans && p2Ans);
      const isRevealed = Boolean(bothAnswered || localRec.isRevealed || remoteRec.isRevealed);

      mergedRecords[qId] = {
        ...remoteRec,
        ...localRec,
        partner1Answer: p1Ans,
        partner1AnsweredAt: p1Time,
        partner2Answer: p2Ans,
        partner2AnsweredAt: p2Time,
        isRevealed,
        reactions: {
          partner1Emoji: remoteRec.reactions?.partner1Emoji || localRec.reactions?.partner1Emoji,
          partner2Emoji: remoteRec.reactions?.partner2Emoji || localRec.reactions?.partner2Emoji,
        },
        rewardClaimed: Boolean(localRec.rewardClaimed || remoteRec.rewardClaimed),
      };
    }
  });

  const qMap = new Map<string, Question>();
  (local.customQuestions || []).forEach((q) => qMap.set(q.id, q));
  (remote.customQuestions || []).forEach((q) => qMap.set(q.id, q));

  return {
    dailyQuestionId: remote.dailyQuestionId || local.dailyQuestionId,
    activeDeckCategory: local.activeDeckCategory,
    records: mergedRecords,
    customQuestions: Array.from(qMap.values()),
  };
};
