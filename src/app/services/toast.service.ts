import { Injectable, signal } from '@angular/core';

type ToastType = 'primary' | 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public message = signal<string | null>(null);
  public type = signal<ToastType>('primary');
  public visible = signal(false);

  public show(message?: string, type: ToastType = 'primary', duration: number = 4000): void {
    this.message.set(message || $localize`:@@ticket.load.error:Error al cargar la información`);
    this.type.set(type);
    this.visible.set(true);

    setTimeout(() => this.close(), duration);
  }

  public close(): void {
    this.visible.set(false);
  }
}
