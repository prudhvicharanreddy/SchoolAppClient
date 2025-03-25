import { AdminService, Teacher } from './../../services/admin.service';
import {  OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service'
import { ToastrService } from 'ngx-toastr';
import { Component, HostListener } from '@angular/core';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { AllCommunityModule, ModuleRegistry ,ClientSideRowModelModule,ValidationModule, ColumnAutoSizeModule }from 'ag-grid-community'; 
import { ActionbuttonComponent } from '../student-records/actionbutton/actionbutton.component'
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewTeacherComponent } from './new-teacher/new-teacher.component';
import { ICellRendererParams } from 'ag-grid-community'
ModuleRegistry.registerModules([ValidationModule,ColumnAutoSizeModule,ClientSideRowModelModule])

@Component({
  selector: 'app-teacher-records',
  imports: [AgGridAngular,RouterOutlet,CommonModule,NewTeacherComponent],
  templateUrl: './teacher-records.component.html',
  styleUrl: './teacher-records.component.css'
})


export class TeacherRecordsComponent {
    @ViewChild(NewTeacherComponent) teacherForm!: NewTeacherComponent;
    teachers: Teacher[] = [];

  showModal = false;
  selectedTeacher: any = null;
  public modules = [ClientSideRowModelModule];
  private gridApi!: GridApi;  
  // Add interface for class teaching items


 
    // Teacher Grid Configuration
    teacherColumnDefs: ColDef[] = [
      { headerName: 'First Name', field: 'firstName', filter: true ,floatingFilter:true },
      { headerName: 'Last Name', field: 'lastName', filter: true ,floatingFilter:true },
      { headerName: 'Email', field: 'email', filter: 'agTextColumnFilter' ,floatingFilter:true },
      { 
        headerName: 'Classes Teaching', 
        field: 'classesTeaching',
        cellRenderer: (params:ICellRendererParams) => {
          return params.value.map((c:ClassTeaching )=> 
            `${c.class} (${c.section}) - ${c.subject}`
          ).join('<br>');
        },
        width: 400,
        autoHeight: true,  // Allow row to expand
    wrapText: true,    // Enable text wrapping
      },
      
      // { 
      //   headerName: 'Join Date', 
      //   field: 'joinDate', 
      //   filter: 'agDateColumnFilter',floatingFilter:true 
      // },
      { 
        headerName: 'Phone Number', 
        field: 'phoneNumber', 
        floatingFilter:true ,
        filter: true
      },
      {
        headerName: 'Actions',
        cellRenderer: ActionbuttonComponent,
        cellRendererParams: {
          onEdit: (id: number) => this.editTeacher(id),
          onDelete: (id: number) => this.deleteTeacher(id)
        },
      }
    ];

    

  constructor(
    public authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private toastr: ToastrService,
     public  modalService:NgbModal,
     
  ) {}


  ngOnInit(): void {
    this.loadTeachers();
    this.checkScreenSize();
  }


  private dateFormatter(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
   handleModalClose()
  {
      this.showModal = false;
      this.selectedTeacher= null; // Clear selection 
  }

 
  private loadTeachers(): void {
    this.adminService.getTeachers().subscribe({
      next: (teachers) => this.teachers = teachers,
      error: (err) => this.toastr.error('Failed to load teachers', 'Error')
    });
  }

  addNewTeacher(teacherData:any){
   if(teacherData.teacherId){//UPDATE RECORD
      this.adminService.updateTeacher(teacherData.teacherId, teacherData)
      .subscribe({
        next: (updatedteacher) => {
          // Update local array
          const index = this.teachers.findIndex(s => s.teacherId === updatedteacher.teacherId);
          this.teachers[index] = updatedteacher;
          this.showModal = false;
          this.toastr.success('teacher updated successfully');
          this.gridApi.setGridOption('rowData', this.teachers);
          
        },
        error: (err) => {
          this.toastr.error('Failed to update teacher');
        }
      });
    }
    else{ //SAVE
      
      this.adminService.addTeachers(teacherData as Omit <Teacher,'teacherId'>)
      .subscribe({
        next: () => {
        this.showModal = false;
        this.toastr.success('teacher created successfully!');
        this.loadTeachers();
      },
      error:(err)=>{
    
        this.toastr.error(err.error[0].description, 'save Failed');
  
      }
    });
    }
  }



 

  onTeacherGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }


  editTeacher(teacherId: number) {
    const teacher = this.teachers.find(s => s.teacherId=== teacherId);
    this.selectedTeacher = teacher;
    this.showModal = true;
  }

  deleteTeacher(id: number) {
    // Implement delete logic
  }

  getRouterState(): string {
    return this.router.url;
  }
  isActive(route: string): boolean {
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
interface ClassTeaching {
  class: string;
  section: string;
  subject: string;
}