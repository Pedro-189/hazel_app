import { PartnerId } from './couple';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  timezone: string;
  role: PartnerId; // 'partner1' | 'partner2'
  pin?: string;
}

export interface CouplePairing {
  coupleCode: string;
  creatorName: string;
  creatorAvatar: string;
  partnerName?: string;
  partnerAvatar?: string;
  isLinked: boolean;
  linkedAt?: string;
}
