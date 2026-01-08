import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trial-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './trial-page.html',
})
export class TrialPage {
  public fileName = signal<string>('');

  public openCheckout(): void {}
  
  public onFileSimulated(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName.set(file.name);
    }
  }

  public onDialogClick(event: MouseEvent): void {
    const dialog = event.target as HTMLDialogElement;
    if (dialog.nodeName === 'DIALOG') {
      dialog.close();
    }
  }
}
