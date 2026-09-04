import { supabase, isSupabaseConfigured } from './supabaseClient';
import { CoupleState } from '../types/couple';
import { HouseState } from '../types/house';
import { QAState } from '../types/qa';

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
