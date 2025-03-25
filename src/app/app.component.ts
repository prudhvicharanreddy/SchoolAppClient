import { Component } from '@angular/core';
import { RouterOutlet,Router,NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SchoolAppClient';
  showNavbar = true;


}
