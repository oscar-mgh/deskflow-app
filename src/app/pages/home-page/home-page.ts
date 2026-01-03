import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeLangBtns } from "../../components/theme-lang-btns/theme-lang-btns";

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ThemeLangBtns],
  templateUrl: './home-page.html',
})
export class HomePage {}
