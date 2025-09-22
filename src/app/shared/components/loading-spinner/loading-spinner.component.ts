import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() message?: string;
  @Input() overlay: boolean = false;

  get spinnerClasses(): string {
    switch (this.size) {
      case 'small': return 'h-4 w-4';
      case 'large': return 'h-12 w-12';
      default: return 'h-8 w-8';
    }
  }
}
