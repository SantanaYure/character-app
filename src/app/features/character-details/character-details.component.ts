import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CharacterService } from '../../core/services/character.service';
import { ModalService } from '../../core/services/modal.service';
import { Character } from '../../core/models/character.model';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss']
})
export class CharacterDetailsComponent implements OnInit, OnDestroy {
  character: Character | null = null;
  isLoading = true;
  activeTab = 'basics';
  
  // História paginada
  historyPages: string[] = [];
  currentPageIndex = 0;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe(params => {
        const characterId = params['id'];
        this.loadCharacter(characterId);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadCharacter(id: string): void {
    this.isLoading = true;
    this.subscription.add(
      this.characterService.getCharacterById(id).subscribe({
        next: (character) => {
          if (character) {
            this.character = character;
            this.setupHistoryPagination();
          } else {
            this.router.navigate(['/dashboard']);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar personagem:', error);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  private setupHistoryPagination(): void {
    if (this.character?.history?.content) {
      this.historyPages = this.paginateText(this.character.history.content);
      this.currentPageIndex = 0;
    } else {
      this.historyPages = [];
    }
  }

  private paginateText(text: string, pageSize: number = 2500): string[] {
    if (!text) return [];
    const pages: string[] = [];
    for (let i = 0; i < text.length; i += pageSize) {
      pages.push(text.substring(i, i + pageSize));
    }
    return pages;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onPreviousPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
    }
  }

  onNextPage(): void {
    if (this.currentPageIndex < this.historyPages.length - 1) {
      this.currentPageIndex++;
    }
  }

  onEdit(): void {
    if (this.character) {
      this.router.navigate(['/character', this.character.id, 'edit']);
    }
  }

  onDelete(): void {
    if (!this.character) return;

    this.subscription.add(
      this.modalService.showConfirmation({
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o personagem "${this.character.characterName}"? Esta ação não pode ser desfeita.`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }).subscribe(confirmed => {
        if (confirmed && this.character) {
          this.deleteCharacter(this.character.id);
        }
      })
    );
  }

  private deleteCharacter(id: string): void {
    this.subscription.add(
      this.characterService.deleteCharacter(id).subscribe({
        next: () => {
          this.modalService.showAlert({
            title: 'Sucesso',
            message: 'Personagem excluído com sucesso!'
          }).subscribe(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        error: (error) => {
          console.error('Erro ao excluir personagem:', error);
          this.modalService.showAlert({
            title: 'Erro',
            message: 'Erro ao excluir personagem. Tente novamente.'
          });
        }
      })
    );
  }

  onBack(): void {
    // Tenta voltar para a lista do cenário se possível
    if (this.character?.scenario) {
      this.router.navigate(['/scenario', this.character.scenario]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  get currentHistoryPage(): string {
    return this.historyPages[this.currentPageIndex] || '';
  }

  get pageInfo(): string {
    if (this.historyPages.length === 0) return 'Página 1 de 1';
    return `Página ${this.currentPageIndex + 1} de ${this.historyPages.length}`;
  }

  get canGoPrevious(): boolean {
    return this.currentPageIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentPageIndex < this.historyPages.length - 1;
  }
}
