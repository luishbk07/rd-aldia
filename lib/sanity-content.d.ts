export type CultureArticle = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  featured: boolean;
  readMinutes: number;
  content?: unknown[];
  body: string[];
  source?: string;
};

export type TourismDestination = {
  slug: string;
  name: string;
  region: string;
  description: string;
  image: string;
  imageAlt: string;
  bestTime: string;
  categories: string[];
  featured: boolean;
  content?: unknown[];
  body: string[];
  publishedAt?: string;
  source?: string;
};

export function mapSanityPost(post: unknown): CultureArticle | null;
export function mapSanityDestination(item: unknown): TourismDestination | null;
export function mapTourismPost(post: unknown): TourismDestination | null;
export function getCulturePosts(): Promise<CultureArticle[]>;
export function getCulturePost(slug: string): Promise<CultureArticle | null>;
export function getTourismDestinations(): Promise<TourismDestination[]>;
export function getTourismDestination(
  slug: string,
): Promise<TourismDestination | null>;
export function getFeaturedCulturePosts(): Promise<CultureArticle[]>;
export function getFeaturedTourism(): Promise<TourismDestination[]>;
