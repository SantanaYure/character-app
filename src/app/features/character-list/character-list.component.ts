import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CharacterService } from '../../core/services/character.service';
import { Character } from '../../core/models/character.model';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit, OnDestroy {
  characters: Character[] = [];
  scenarioName: string = '';
  isLoading = true;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe(params => {
        this.scenarioName = params['name'];
        this.loadCharacters();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadCharacters(): void {
    this.isLoading = true;
    this.subscription.add(
      this.characterService.getCharactersByScenario(this.scenarioName).subscribe({
        next: (characters) => {
          this.characters = characters;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar personagens:', error);
          this.isLoading = false;
        }
      })
    );
  }

  onCharacterClick(characterId: string): void {
    this.router.navigate(['/character', characterId]);
  }

  onBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  onCreateCharacter(): void {
    this.router.navigate(['/create']);
  }

  trackByCharacter(index: number, character: Character): string {
    return character.id;
  }
}
