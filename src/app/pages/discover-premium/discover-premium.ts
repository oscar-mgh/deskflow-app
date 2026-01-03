import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeLangBtns } from '../../components/theme-lang-btns/theme-lang-btns';

@Component({
  selector: 'app-discover-premium',
  imports: [RouterLink, ThemeLangBtns],
  templateUrl: './discover-premium.html',
})
export class DiscoverPremium {
  @ViewChild('checkoutModal') checkoutModal!: HTMLDialogElement;

  upgradeToPremium() {}

  openCheckout() {}

  confirmUpgrade() {}
}
