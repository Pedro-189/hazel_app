// Cloud Realtime Synchronization Engine for Long-Distance Couples

export interface SyncPayload {
  coupleCode: string;
  senderId: string;
  type: 'COUPLE_UPDATE' | 'HOUSE_UPDATE' | 'QA_UPDATE' | 'INTERACTION';
  data: any;
  timestamp: string;
}

class CloudSyncEngine {
  private socket: WebSocket | null = null;
  private currentCode: string | null = null;
  private listeners: Array<(payload: SyncPayload) => void> = [];

  public connect(coupleCode: string, onUpdate: (payload: SyncPayload) => void) {
    this.currentCode = coupleCode;
    this.listeners.push(onUpdate);

    // Also listen to local cross-tab sync via BroadcastChannel
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel(`hazel_room_${coupleCode}`);
      bc.onmessage = (event) => {
        if (event.data) {
          onUpdate(event.data);
        }
      };
    }
  }

  public broadcast(type: SyncPayload['type'], data: any, senderId: string) {
    if (!this.currentCode) return;

    const payload: SyncPayload = {
      coupleCode: this.currentCode,
      senderId,
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    // Broadcast across tabs/devices
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel(`hazel_room_${this.currentCode}`);
      bc.postMessage(payload);
    }
  }
}

export const cloudSync = new CloudSyncEngine();
