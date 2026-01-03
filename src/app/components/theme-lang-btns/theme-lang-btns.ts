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
    const nextLocale = this.currentLocale.startsWith('es') ? 'en' : 'es';

    const currentPath = window.location.pathname;

    let newPath: string;

    if (currentPath.includes(`/${this.currentLocale}/`)) {
      newPath = currentPath.replace(`/${this.currentLocale}/`, `/${nextLocale}/`);
    } else if (currentPath.endsWith(`/${this.currentLocale}`)) {
      newPath = currentPath.replace(`/${this.currentLocale}`, `/${nextLocale}`);
    } else {
      newPath = `/${nextLocale}${currentPath}`;
    }

    window.location.href = newPath;
  }
}
