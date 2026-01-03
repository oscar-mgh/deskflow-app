import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  currentTheme = signal(localStorage.getItem('theme') || 'custom');
  currentLang = signal(localStorage.getItem('lang') || 'es');

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  toggleTheme() {
    const newTheme = this.currentTheme() === 'custom' ? 'garden' : 'custom';
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: string) {
    this.currentTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleLang() {
    const newLang = this.currentLang() === 'es' ? 'en' : 'es';
    this.currentLang.set(newLang);
    localStorage.setItem('lang', newLang);
  }
}
