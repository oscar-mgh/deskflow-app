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
  currentLocale = inject(LOCALE_ID);

  switchLanguage() {
    const currentLang = this.currentLocale.substring(0, 2);
    const nextLang = currentLang === 'es' ? 'en' : 'es';

    const path = window.location.pathname;

    let newPath = path.replace(`/${currentLang}`, `/${nextLang}`);

    if (!newPath.startsWith(`/${nextLang}`)) {
      newPath = `/${nextLang}${path}`;
    }

    window.location.href = newPath;
  }
}
