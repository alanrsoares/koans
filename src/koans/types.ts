export interface Exercise {
  description: string;
  template: string;
}

export interface Category {
  name: string;
  quote: string;
  exercises: Exercise[];
}

export interface LanguagePath {
  name: string;
  theme: string;
  categories: Category[];
}

export type KoanData = Record<string, LanguagePath>;
