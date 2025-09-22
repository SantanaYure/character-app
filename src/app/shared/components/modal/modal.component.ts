import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../core/services/modal.service';
import { ModalConfig } from '../../../core/models/character.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  modalConfig: ModalConfig | null = null;
  isVisible = false;
  private subscription: Subscription = new Subscription();

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.modalService.modal$.subscribe(config => {
        this.modalConfig = config;
        this.isVisible = !!config;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onConfirm(): void {
    this.modalService.confirmModal();
  }

  onCancel(): void {
    this.modalService.cancelModal();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && this.modalConfig?.type !== 'loading') {
      this.onCancel();
    }
  }
}
