export interface Attraction {
  id: number;
  name: string;
  description: string;
}

export interface Work {
  id: number;
  attraction_id: number;
  title: string;
  author: string;
  description: string;
}

export type AttractionInput = Pick<Attraction, 'name' | 'description'>;
export type WorkInput = Pick<Work, 'title' | 'author' | 'description'>;
