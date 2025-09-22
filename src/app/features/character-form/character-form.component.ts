import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime } from 'rxjs';
import { CharacterService } from '../../core/services/character.service';
import { ModalService } from '../../core/services/modal.service';
import { StorageService } from '../../core/services/storage.service';
import { Character, Ability, CharacterFormData } from '../../core/models/character.model';

@Component({
  selector: 'app-character-form',
  templateUrl: './character-form.component.html',
  styleUrls: ['./character-form.component.scss']
})
export class CharacterFormComponent implements OnInit, OnDestroy {
  characterForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  characterId: string | null = null;
  imagePreview: string | null = null;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private modalService: ModalService,
    private storageService: StorageService
  ) {
    this.characterForm = this.createForm();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe(params => {
        this.characterId = params['id'];
        this.isEditMode = !!this.characterId;
        
        if (this.isEditMode) {
          this.loadCharacterForEdit();
        } else {
          this.checkForDraft();
        }
      })
    );

    // Auto-save draft
    this.subscription.add(
      this.characterForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe(() => {
          if (!this.isEditMode) {
            this.saveDraft();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      creatorName: ['', Validators.required],
      characterName: ['', Validators.required],
      scenario: ['', Validators.required],
      age: [''],
      height: [''],
      weight: [''],
      role: [''],
      physicalChars: [''],
      personality: [''],
      motivation: [''],
      historyContent: [''],
      abilities: this.fb.array([])
    });
  }

  private loadCharacterForEdit(): void {
    if (!this.characterId) return;

    this.isLoading = true;
    this.subscription.add(
      this.characterService.getCharacterById(this.characterId).subscribe({
        next: (character) => {
          if (character) {
            this.populateForm(character);
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

  private populateForm(character: Character): void {
    this.characterForm.patchValue({
      creatorName: character.creatorName,
      characterName: character.characterName,
      scenario: character.scenario,
      age: character.age || '',
      height: character.height || '',
      weight: character.weight || '',
      role: character.role || '',
      physicalChars: character.physicalChars || '',
      personality: character.personality || '',
      motivation: character.motivation || '',
      historyContent: character.history?.content || ''
    });

    if (character.image) {
      this.imagePreview = character.image;
    }

    // Populate abilities
    const abilitiesArray = this.characterForm.get('abilities') as FormArray;
    character.abilities.forEach(ability => {
      abilitiesArray.push(this.createAbilityGroup(ability));
    });
  }

  private checkForDraft(): void {
    const draft = this.characterService.loadDraft();
    if (draft) {
      this.subscription.add(
        this.modalService.showConfirmation({
          title: 'Rascunho Encontrado',
          message: 'Deseja restaurar o rascunho não salvo?',
          confirmText: 'Restaurar',
          cancelText: 'Descartar'
        }).subscribe(restore => {
          if (restore) {
            this.loadDraft(draft);
          } else {
            this.characterService.clearDraft();
          }
        })
      );
    }
  }

  private loadDraft(draft: Partial<CharacterFormData>): void {
    this.characterForm.patchValue(draft);
    
    if (draft.image) {
      this.imagePreview = draft.image;
    }

    if (draft.abilities) {
      const abilitiesArray = this.characterForm.get('abilities') as FormArray;
      draft.abilities.forEach(ability => {
        abilitiesArray.push(this.createAbilityGroup(ability));
      });
    }
  }

  private saveDraft(): void {
    const formData = this.getFormData();
    this.characterService.saveDraft(formData);
  }

  private createAbilityGroup(ability?: Ability): FormGroup {
    return this.fb.group({
      name: [ability?.name || '', Validators.required],
      description: [ability?.description || ''],
      effect: [ability?.effect || '']
    });
  }

  get abilitiesArray(): FormArray {
    return this.characterForm.get('abilities') as FormArray;
  }

  addAbility(): void {
    this.abilitiesArray.push(this.createAbilityGroup());
  }

  removeAbility(index: number): void {
    this.abilitiesArray.removeAt(index);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      this.storageService.readImageAsBase64(file)
        .then(base64 => {
          this.imagePreview = base64;
          this.saveDraft(); // Save draft with new image
        })
        .catch(error => {
          console.error('Erro ao processar imagem:', error);
          this.modalService.showAlert({
            title: 'Erro',
            message: 'Erro ao processar imagem. Verifique se o arquivo é uma imagem válida.'
          });
        });
    }
  }

  onHistoryFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      this.storageService.readTextFile(file)
        .then(content => {
          this.characterForm.patchValue({ historyContent: content });
        })
        .catch(error => {
          console.error('Erro ao processar arquivo:', error);
          this.modalService.showAlert({
            title: 'Erro',
            message: 'Erro ao processar arquivo. Certifique-se de que é um arquivo .txt válido.'
          });
        });
    }
  }

  private getFormData(): CharacterFormData {
    const formValue = this.characterForm.value;
    return {
      ...formValue,
      image: this.imagePreview || undefined,
      abilities: formValue.abilities.filter((ability: Ability) => ability.name.trim())
    };
  }

  onSave(): void {
    if (this.characterForm.invalid) {
      this.modalService.showAlert({
        title: 'Formulário Inválido',
        message: 'Por favor, preencha todos os campos obrigatórios.'
      });
      return;
    }

    this.isLoading = true;
    const formData = this.getFormData();

    const operation = this.isEditMode 
      ? this.characterService.updateCharacter(this.characterId!, formData)
      : this.characterService.createCharacter(formData);

    this.subscription.add(
      operation.subscribe({
        next: (character) => {
          this.characterService.clearDraft();
          this.modalService.showAlert({
            title: 'Sucesso!',
            message: `Personagem "${character.characterName}" ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`
          }).subscribe(() => {
            this.router.navigate(['/character', character.id]);
          });
        },
        error: (error) => {
          console.error('Erro ao salvar personagem:', error);
          this.modalService.showAlert({
            title: 'Erro',
            message: 'Erro ao salvar personagem. Tente novamente.'
          });
          this.isLoading = false;
        }
      })
    );
  }

  onDiscard(): void {
    this.subscription.add(
      this.modalService.showConfirmation({
        title: 'Descartar Alterações',
        message: 'Tem certeza que deseja descartar todas as alterações? O rascunho salvo também será apagado.',
        confirmText: 'Descartar',
        cancelText: 'Continuar Editando'
      }).subscribe(confirmed => {
        if (confirmed) {
          this.characterService.clearDraft();
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  onPreview(): void {
    // Implementar preview se necessário
    this.modalService.showAlert({
      title: 'Preview',
      message: 'Funcionalidade de preview será implementada em breve.'
    });
  }

  onBack(): void {
    if (this.characterForm.dirty) {
      this.subscription.add(
        this.modalService.showConfirmation({
          title: 'Alterações não Salvas',
          message: 'Você tem alterações não salvas. Deseja sair mesmo assim?',
          confirmText: 'Sair',
          cancelText: 'Continuar Editando'
        }).subscribe(confirmed => {
          if (confirmed) {
            this.navigateBack();
          }
        })
      );
    } else {
      this.navigateBack();
    }
  }

  private navigateBack(): void {
    if (this.isEditMode && this.characterId) {
      this.router.navigate(['/character', this.characterId]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  get formTitle(): string {
    return this.isEditMode ? 'Editar Personagem' : 'Criar Novo Personagem';
  }
}
