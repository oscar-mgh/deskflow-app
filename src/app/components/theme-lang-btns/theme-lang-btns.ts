import { Component, inject } from '@angular/core';
import { ConfigService } from '../../services/theme.service';

@Component({
  selector: 'theme-lang-btns',
  imports: [],
  templateUrl: './theme-lang-btns.html',
})
export class ThemeLangBtns {
  config = inject(ConfigService);
}
