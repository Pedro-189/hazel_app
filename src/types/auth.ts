export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  timezone: string;
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
