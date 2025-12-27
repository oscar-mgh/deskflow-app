import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-discover-premium',
  imports: [RouterLink],
  templateUrl: './discover-premium.html',
  styles: ``,
})
export class DiscoverPremium {
  @ViewChild('checkoutModal') checkoutModal!: HTMLDialogElement;

  upgradeToPremium() {}

  openCheckout() {
  }

  confirmUpgrade() {
  }
}
