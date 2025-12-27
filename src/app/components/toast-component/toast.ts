import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

type ToastType = 'primary' | 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styles: ``,
})
export class ToastComponent {
  @Input() message: string | null = null;
  @Input() type: ToastType = 'primary';
  visible = signal(false);

  show(message: string, type: ToastType = 'primary', duration = 4500) {
    this.message = message;
    this.type = type;
    this.visible.set(true);
    setTimeout(() => this.visible.set(false), duration);
  }

  close() {
    this.visible.set(false);
  }
}
