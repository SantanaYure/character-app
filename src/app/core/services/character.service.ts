import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Character, ScenarioGroup, CharacterFormData } from '../models/character.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private charactersSubject = new BehaviorSubject<Character[]>([]);
  public characters$ = this.charactersSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadCharactersFromStorage();
  }

  private loadCharactersFromStorage(): void {
    const characters = this.storageService.loadCharacters();
    this.charactersSubject.next(characters);
  }

  private saveCharactersToStorage(characters: Character[]): void {
    this.storageService.saveCharacters(characters);
    this.charactersSubject.next(characters);
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  // Observables
  getCharacters(): Observable<Character[]> {
    return this.characters$;
  }

  getCharacterById(id: string): Observable<Character | undefined> {
    return this.characters$.pipe(
      map(characters => characters.find(char => char.id === id))
    );
  }

  getScenarioGroups(): Observable<ScenarioGroup[]> {
    return this.characters$.pipe(
      map(characters => {
        const groups: { [key: string]: Character[] } = {};
        
        characters.forEach(character => {
          const scenarioName = character.scenario || 'Personagens sem cenário';
          if (!groups[scenarioName]) {
            groups[scenarioName] = [];
          }
          groups[scenarioName].push(character);
        });

        return Object.entries(groups).map(([name, chars]) => ({
          name,
          characters: chars,
          count: chars.length
        }));
      })
    );
  }

  getCharactersByScenario(scenario: string): Observable<Character[]> {
    return this.characters$.pipe(
      map(characters => 
        characters.filter(char => 
          (char.scenario || 'Personagens sem cenário') === scenario
        )
      )
    );
  }

  // Operações CRUD
  createCharacter(formData: CharacterFormData): Observable<Character> {
    return new Observable(observer => {
      const now = new Date();
      const character: Character = {
        id: this.generateId(),
        creatorName: formData.creatorName,
        characterName: formData.characterName,
        scenario: formData.scenario,
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        role: formData.role,
        abilities: formData.abilities || [],
        physicalChars: formData.physicalChars,
        personality: formData.personality,
        motivation: formData.motivation,
        history: formData.historyContent ? { content: formData.historyContent } : undefined,
        image: formData.image,
        createdAt: now,
        updatedAt: now
      };

      const currentCharacters = this.charactersSubject.value;
      const updatedCharacters = [...currentCharacters, character];
      
      this.saveCharactersToStorage(updatedCharacters);
      
      // Download automático do JSON
      this.storageService.downloadAsJson(character, `${character.characterName}.json`);
      
      observer.next(character);
      observer.complete();
    });
  }

  updateCharacter(id: string, formData: CharacterFormData): Observable<Character> {
    return new Observable(observer => {
      const currentCharacters = this.charactersSubject.value;
      const index = currentCharacters.findIndex(char => char.id === id);
      
      if (index === -1) {
        observer.error(new Error('Personagem não encontrado'));
        return;
      }

      const existingCharacter = currentCharacters[index];
      const updatedCharacter: Character = {
        ...existingCharacter,
        creatorName: formData.creatorName,
        characterName: formData.characterName,
        scenario: formData.scenario,
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        role: formData.role,
        abilities: formData.abilities || [],
        physicalChars: formData.physicalChars,
        personality: formData.personality,
        motivation: formData.motivation,
        history: formData.historyContent ? { content: formData.historyContent } : undefined,
        image: formData.image,
        updatedAt: new Date()
      };

      const updatedCharacters = [...currentCharacters];
      updatedCharacters[index] = updatedCharacter;
      
      this.saveCharactersToStorage(updatedCharacters);
      
      // Download automático do JSON atualizado
      this.storageService.downloadAsJson(updatedCharacter, `${updatedCharacter.characterName}.json`);
      
      observer.next(updatedCharacter);
      observer.complete();
    });
  }

  deleteCharacter(id: string): Observable<boolean> {
    return new Observable(observer => {
      const currentCharacters = this.charactersSubject.value;
      const updatedCharacters = currentCharacters.filter(char => char.id !== id);
      
      if (updatedCharacters.length === currentCharacters.length) {
        observer.error(new Error('Personagem não encontrado'));
        return;
      }

      this.saveCharactersToStorage(updatedCharacters);
      observer.next(true);
      observer.complete();
    });
  }

  // Métodos utilitários
  exportCharacterAsJson(character: Character): void {
    this.storageService.downloadAsJson(character, `${character.characterName}.json`);
  }

  importCharacterFromJson(jsonData: string): Observable<Character> {
    return new Observable(observer => {
      try {
        const characterData = JSON.parse(jsonData);
        
        // Validação básica dos dados
        if (!characterData.characterName || !characterData.creatorName || !characterData.scenario) {
          observer.error(new Error('Dados do personagem inválidos'));
          return;
        }

        // Cria um novo personagem com ID único
        const formData: CharacterFormData = {
          creatorName: characterData.creatorName,
          characterName: characterData.characterName,
          scenario: characterData.scenario,
          age: characterData.age,
          height: characterData.height,
          weight: characterData.weight,
          role: characterData.role,
          abilities: characterData.abilities || [],
          physicalChars: characterData.physicalChars,
          personality: characterData.personality,
          motivation: characterData.motivation,
          historyContent: characterData.history?.content,
          image: characterData.image
        };

        this.createCharacter(formData).subscribe({
          next: (character) => observer.next(character),
          error: (error) => observer.error(error)
        });

      } catch (error) {
        observer.error(new Error('Erro ao processar arquivo JSON'));
      }
    });
  }

  // Métodos para draft
  saveDraft(formData: Partial<CharacterFormData>): void {
    this.storageService.saveDraft(formData);
  }

  loadDraft(): Partial<CharacterFormData> | null {
    return this.storageService.loadDraft();
  }

  clearDraft(): void {
    this.storageService.clearDraft();
  }
}
