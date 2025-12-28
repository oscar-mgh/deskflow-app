import { Injectable, signal } from '@angular/core';

type ToastType = 'primary' | 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  message = signal<string | null>(null);
  type = signal<ToastType>('primary');
  visible = signal(false);

  show(message: string, type: ToastType = 'primary', duration: number = 4000) {
    this.message.set(message);
    this.type.set(type);
    this.visible.set(true);

    setTimeout(() => this.close(), duration);
  }

  close() {
    this.visible.set(false);
  }
}
