// Per-language, per-category solved flags (one boolean per koan).
export interface ProgressState {
  [lang: string]: {
    [categoryName: string]: boolean[];
  };
}

// Per-language, per-category, per-koan blank answers.
export interface AnswersState {
  [lang: string]: {
    [categoryName: string]: {
      [koanIndex: number]: string[];
    };
  };
}
