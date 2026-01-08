import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dash-empty',
  imports: [RouterLink],
  templateUrl: './dash-empty.html',
})
export class DashEmpty {
  public isAdmin = input.required<boolean>();
  public isAgent = input.required<boolean>();
}
