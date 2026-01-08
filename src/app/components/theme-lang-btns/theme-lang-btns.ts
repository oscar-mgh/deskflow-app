import { CommonModule } from '@angular/common';
import { Component, inject, LOCALE_ID } from '@angular/core';
import { ConfigService } from '../../services/theme.service';

@Component({
  selector: 'theme-lang-btns',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-lang-btns.html',
})
export class ThemeLangBtns {
  public config = inject(ConfigService);
  public currentLocale = inject(LOCALE_ID);

  public switchLanguage(): void {
    const currentLang = this.currentLocale.substring(0, 2);
    const nextLang = currentLang === 'es' ? 'en' : 'es';

    const pathWithoutLang = window.location.pathname.replace(`/${currentLang}`, '');
    const newPath = `/${nextLang}${pathWithoutLang}`.replace(/\/+/g, '/');

    window.location.href = newPath;
  }
}
