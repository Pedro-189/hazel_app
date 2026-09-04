import { PartnerId } from './couple';

export type RoomId = 'living_room' | 'bedroom' | 'kitchen' | 'balcony' | 'garden';

export interface Room {
  id: RoomId;
  name: string;
  subtitle: string;
  icon: string;
  wallColor: string;
  floorType: 'wood' | 'carpet' | 'tiles' | 'grass' | 'marble' | 'brick';
  unlocked: boolean;
  unlockCost: number;
  levelRequired: number;
  theme: 'cozy_warm' | 'pastel_dream' | 'starry_night' | 'botanical' | 'sunset';
}

export type FurnitureCategory = 
  | 'walls'
  | 'seating' 
  | 'beds' 
  | 'tables' 
  | 'plants' 
  | 'decor' 
  | 'lighting' 
  | 'pets' 
  | 'frames' 
  | 'electronics' 
  | 'kitchenware';

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  price: number;
  description: string;
  icon: string;
  svgType: string;
  width: number;
  height: number;
  placementType?: 'wall' | 'floor'; // 'wall' items snap to upper wall rows (0-2)
  isUnlocked: boolean;
  canHostPhoto?: boolean;
  interactiveSound?: string;
  specialAction?: 'purr' | 'turn_on_light' | 'water_plant' | 'play_music' | 'make_coffee' | 'diffuse_aroma';
}

export interface PlacedFurniture {
  id: string;
  furnitureId: string;
  roomId: RoomId;
  x: number; // grid column (0 to 8)
  y: number; // grid row (0 to 6)
  rotation: 0 | 90 | 180 | 270;
  layer?: number; // Layer order / z-index offset (-5 to 5)
  placedBy: PartnerId;
  placedAt: string;
  customPhotoUrl?: string;
  customNote?: string;
  state?: {
    isOn?: boolean;
    lastWatered?: string;
    happiness?: number;
  };
}

export interface HouseActivityLog {
  id: string;
  partnerId: PartnerId;
  action: 'placed' | 'moved' | 'removed' | 'photo_added' | 'room_unlocked' | 'interacted';
  itemName: string;
  roomName: string;
  timestamp: string;
  icon: string;
}

export interface HouseState {
  currentRoomId: RoomId;
  rooms: Record<RoomId, Room>;
  placedItems: PlacedFurniture[];
  activityLogs: HouseActivityLog[];
  inventory: string[]; // List of purchased furniture item IDs
}
