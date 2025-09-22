import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CharacterService } from '../../core/services/character.service';
import { ScenarioGroup } from '../../core/models/character.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  scenarioGroups: ScenarioGroup[] = [];
  isLoading = true;
  private subscription: Subscription = new Subscription();

  constructor(
    private characterService: CharacterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadScenarioGroups();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadScenarioGroups(): void {
    this.subscription.add(
      this.characterService.getScenarioGroups().subscribe({
        next: (groups) => {
          this.scenarioGroups = groups;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar cenários:', error);
          this.isLoading = false;
        }
      })
    );
  }

  onScenarioClick(scenarioName: string): void {
    this.router.navigate(['/scenario', scenarioName]);
  }

  onCreateCharacter(): void {
    this.router.navigate(['/create']);
  }

  trackByScenario(index: number, scenario: ScenarioGroup): string {
    return scenario.name;
  }
}
