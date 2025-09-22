import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ModalConfig } from '../models/character.model';

export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface AlertConfig {
  title: string;
  message: string;
  confirmText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalConfig | null>(null);
  private responseSubject = new Subject<boolean>();
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public modal$ = this.modalSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor() { }

  showConfirmation(config: ConfirmationConfig): Observable<boolean> {
    const modalConfig: ModalConfig = {
      title: config.title,
      message: config.message,
      confirmText: config.confirmText || 'Confirmar',
      cancelText: config.cancelText || 'Cancelar',
      type: 'confirmation'
    };

    this.modalSubject.next(modalConfig);
    
    return new Observable(observer => {
      const subscription = this.responseSubject.subscribe(result => {
        observer.next(result);
        observer.complete();
        subscription.unsubscribe();
      });
    });
  }

  showAlert(config: AlertConfig): Observable<void> {
    const modalConfig: ModalConfig = {
      title: config.title,
      message: config.message,
      confirmText: config.confirmText || 'OK',
      type: 'alert'
    };

    this.modalSubject.next(modalConfig);
    
    return new Observable(observer => {
      const subscription = this.responseSubject.subscribe(() => {
        observer.next();
        observer.complete();
        subscription.unsubscribe();
      });
    });
  }

  showLoading(message?: string): void {
    const modalConfig: ModalConfig = {
      title: 'Carregando...',
      message: message || 'Por favor, aguarde...',
      type: 'loading'
    };

    this.modalSubject.next(modalConfig);
    this.loadingSubject.next(true);
  }

  hideLoading(): void {
    this.loadingSubject.next(false);
    this.hideModal();
  }

  hideModal(): void {
    this.modalSubject.next(null);
  }

  confirmModal(): void {
    this.responseSubject.next(true);
    this.hideModal();
  }

  cancelModal(): void {
    this.responseSubject.next(false);
    this.hideModal();
  }
}
