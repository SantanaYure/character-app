import { Injectable } from '@angular/core';
import { Character, CharacterFormData } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'characterAppDB';
  private readonly DRAFT_KEY = 'characterApp_draft';

  constructor() { }

  // Operações de localStorage para personagens
  saveCharacters(characters: Character[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(characters));
    } catch (error) {
      console.error('Erro ao salvar personagens:', error);
    }
  }

  loadCharacters(): Character[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const characters = JSON.parse(data);
        // Converte strings de data de volta para objetos Date
        return characters.map((char: any) => ({
          ...char,
          createdAt: new Date(char.createdAt),
          updatedAt: new Date(char.updatedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
      return [];
    }
  }

  // Operações de draft
  saveDraft(draft: Partial<CharacterFormData>): void {
    try {
      localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
    }
  }

  loadDraft(): Partial<CharacterFormData> | null {
    try {
      const data = localStorage.getItem(this.DRAFT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao carregar rascunho:', error);
      return null;
    }
  }

  clearDraft(): void {
    try {
      localStorage.removeItem(this.DRAFT_KEY);
    } catch (error) {
      console.error('Erro ao limpar rascunho:', error);
    }
  }

  // Operações de arquivo
  downloadAsJson(data: any, filename: string): void {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", filename);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error('Erro ao fazer download do arquivo:', error);
    }
  }

  readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.type !== 'text/plain') {
        reject(new Error('Apenas arquivos .txt são suportados'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };
      reader.readAsText(file);
    });
  }

  readImageAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Apenas arquivos de imagem são suportados'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Erro ao ler imagem'));
      };
      reader.readAsDataURL(file);
    });
  }
}
