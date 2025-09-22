import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fab-button',
  templateUrl: './fab-button.component.html',
  styleUrls: ['./fab-button.component.scss']
})
export class FabButtonComponent {
  @Input() icon: string = 'plus';
  @Input() position: 'bottom-right' | 'bottom-left' = 'bottom-right';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    this.clicked.emit();
  }

  get positionClasses(): string {
    return this.position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6';
  }

  get sizeClasses(): string {
    switch (this.size) {
      case 'small': return 'w-12 h-12';
      case 'large': return 'w-16 h-16';
      default: return 'w-14 h-14';
    }
  }
}
