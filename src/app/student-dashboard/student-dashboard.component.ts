
import {  OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Component, HostListener } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { AllCommunityModule, ModuleRegistry ,ClientSideRowModelModule,ValidationModule, ColumnAutoSizeModule }from 'ag-grid-community'; 


ModuleRegistry.registerModules([ValidationModule,ColumnAutoSizeModule,ClientSideRowModelModule])


@Component({
  selector: 'app-student-dashboard',
  imports: [RouterModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void 
  {
    this.checkScreenSize();
  }

  getRouterState(): string 
  {
    return this.router.url;
  }
  isActive(route: string): boolean 
  {
    return this.router.url.includes(route);
  }

  isMobile = false;
  sidebarActive = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }


  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.sidebarActive = false;
    }
  }
}
