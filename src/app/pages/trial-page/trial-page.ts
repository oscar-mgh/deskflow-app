import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeLangBtns } from '../../components/theme-lang-btns/theme-lang-btns';

@Component({
  selector: 'app-trial-page',
  imports: [RouterLink, FormsModule, ThemeLangBtns],
  templateUrl: './trial-page.html',
})
export class TrialPage {
  fileName = signal<string>('');
  openCheckout() {}
  onFileSimulated(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName.set(file.name);
    }
  }

  onDialogClick(event: MouseEvent) {
    const dialog = event.target as HTMLDialogElement;
    if (dialog.nodeName === 'DIALOG') {
      dialog.close();
    }
  }
}
