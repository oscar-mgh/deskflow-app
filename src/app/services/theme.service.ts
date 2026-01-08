import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public currentTheme = signal(localStorage.getItem('theme') || 'custom');
  public currentLang = signal(localStorage.getItem('lang') || 'es');

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  public toggleTheme(): void {
    const newTheme = this.currentTheme() === 'custom' ? 'garden' : 'custom';
    this.applyTheme(newTheme);
  }

  public applyTheme(theme: string): void {
    this.currentTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  public toggleLang(): void {
    const newLang = this.currentLang() === 'es' ? 'en' : 'es';
    this.currentLang.set(newLang);
    localStorage.setItem('lang', newLang);
  }
}
