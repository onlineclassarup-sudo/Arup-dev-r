export interface RobloxGame {
  placeId: string;
  universeId: number;
  slug: string;
  title: string;
  officialTitle?: string;
  role: 'Lead Developer' | 'Developer';
  category: string;
  genre: string;
  url: string;
  thumbnail: string;
  fallbackThumbnail: string;
  description: string;
  highlights: string[];
  features: string[];
  techStack: string[];
  stats: {
    playing: number;
    visits: number;
    favoritedCount: number;
    maxPlayers?: number;
    updated?: string;
  };
}

export type StoreCategory = 'All' | 'Systems & Scripts' | 'Game Templates' | '3D Models';

export type CurrencyMode = 'all' | 'robux' | 'bdt' | 'usdt';

export interface StoreAsset {
  id: string;
  title: string;
  category: 'Systems & Scripts' | 'Game Templates' | '3D Models';
  badge: string;
  prices: {
    robux: string;
    bdt: string;
    usdt: string;
  };
  summary: string;
  description: string;
  features: string[];
  deliverables: string[];
  compatibility: string;
  rating: number;
  reviewsCount: number;
  previewImage: string;
  discordInquiryText: string;
}

export interface TechSkill {
  name: string;
  category: 'Core Architecture' | 'Databases & State' | 'Physics & Engine' | '3D & Visuals' | 'DevOps & Tooling';
  proficiency: number;
  iconName: string;
  description: string;
  tags: string[];
}

