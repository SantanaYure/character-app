import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() showBackButton: boolean = false;
  @Input() backButtonText: string = '← Voltar';
  @Output() backClicked = new EventEmitter<void>();

  onBackClick(): void {
    this.backClicked.emit();
  }
}
