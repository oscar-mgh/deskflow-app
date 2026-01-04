import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dash-empty',
  imports: [RouterLink],
  templateUrl: './dash-empty.html',
})
export class DashEmpty {
  isAdmin = input.required<boolean>();
  isAgent = input.required<boolean>();
}
