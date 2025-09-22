export interface Character {
  id: string;
  creatorName: string;
  characterName: string;
  scenario: string;
  age?: string;
  height?: string;
  weight?: string;
  role?: string;
  abilities: Ability[];
  physicalChars?: string;
  personality?: string;
  motivation?: string;
  history?: CharacterHistory;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ability {
  name: string;
  description?: string;
  effect?: string;
}

export interface CharacterHistory {
  content: string;
  fileName?: string;
}

export interface ScenarioGroup {
  name: string;
  characters: Character[];
  count: number;
}

export interface ModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type: 'confirmation' | 'alert' | 'loading';
}

export interface CharacterFormData {
  creatorName: string;
  characterName: string;
  scenario: string;
  age?: string;
  height?: string;
  weight?: string;
  role?: string;
  abilities: Ability[];
  physicalChars?: string;
  personality?: string;
  motivation?: string;
  historyContent?: string;
  image?: string;
}
