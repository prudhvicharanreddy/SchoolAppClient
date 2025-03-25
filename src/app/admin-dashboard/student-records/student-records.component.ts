import { AdminService, Student } from './../../services/admin.service';
import {  OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service'
import { ToastrService } from 'ngx-toastr';
import { Component, HostListener } from '@angular/core';
import { ColDef, GridReadyEvent ,GridApi} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { AllCommunityModule, ModuleRegistry ,ClientSideRowModelModule,ValidationModule, ColumnAutoSizeModule }from 'ag-grid-community'; 
import { NewStudentComponent } from './new-student/new-student.component';
import { ActionbuttonComponent } from './actionbutton/actionbutton.component';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

ModuleRegistry.registerModules([ValidationModule,ColumnAutoSizeModule,ClientSideRowModelModule,AllCommunityModule])

@Component({
  selector: 'app-student-records',
  imports: [AgGridAngular,RouterOutlet,RouterModule,NewStudentComponent,CommonModule],
  templateUrl: './student-records.component.html',
  styleUrl: './student-records.component.css'
})
export class StudentRecordsComponent {
  @ViewChild(NewStudentComponent) studentForm!: NewStudentComponent;
students: Student[] = [];
  // // teachers: User[] = [];
  // students$: Observable<any[]>;
  // teachers$: Observable<any[]>;
  // Student Grid Configuration
  public modules = [ClientSideRowModelModule];
  private gridApi!: GridApi;  
  showModal = false;
  selectedStudent: any = null;
  studentColumnDefs: ColDef[] = [
    { headerName: 'First Name', field: 'studentFirstName', filter: true, sortable: true,floatingFilter:true },
    { headerName: 'Last Name', field: 'studentLastName', filter: true, sortable: true,floatingFilter:true },
    { headerName: 'Email', field: 'email', filter: true, sortable: true,floatingFilter:true},
    { headerName: 'Phone Number',field: 'phoneNumber',filter: true, sortable: true,floatingFilter:true},
    { headerName: 'Class',field: 'className',filter: true, sortable: true,floatingFilter:true },
    { headerName: 'Section',field: 'sectionName',filter: true, sortable: true,floatingFilter:true },

    {
      headerName: 'Actions',
      cellRenderer: ActionbuttonComponent,
      cellRendererParams: {
        onEdit: (id: number) => this.editStudent(id),
        onDelete: (id: number) => this.deleteStudent(id)
      },
      //suppressFilter: true,
      //suppressSorting: true
    }
    
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private AdminService:AdminService,
    private modalService:NgbModal,
    
    
  ) {}


  ngOnInit(): void {
    this.loadStudents();
    this.checkScreenSize();
    
  }


  private dateFormatter(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  private loadStudents(): void {
    this.AdminService.getStudents().subscribe({
      next: (students) => this.students = students,
      error: (err) => this.toastr.error('Failed to load students', 'Error')
     });
  }

  addNewStudent(studentData:any ){ //NEW STUDENT POP-UP
    
    if(studentData.studentId){//UPDATE RECORD
      this.AdminService.updateStudent(studentData.studentId, studentData)
      .subscribe({
        next: (updatedStudent) => {
          // Update local array
          const index = this.students.findIndex(s => s.studentId === updatedStudent.studentId);
          this.students[index] = updatedStudent;
          this.showModal = false;
          this.toastr.success('Student updated successfully');
          this.gridApi.setGridOption('rowData', this.students);
        },
        error: (err) => {
          this.toastr.error('Failed to update student');
        }
      });
    }
    else{ //SAVE
      
      this.AdminService.addStudent(studentData as Omit <Student,'studentId'>)
      .subscribe({
        next: () => {
        this.showModal = false;
        this.toastr.success('Student created successfully!');
        this.loadStudents();
      },
      error:(err)=>{
    
        this.toastr.error(err.error[0].description, 'Registration Failed');
  
      }
    });
    }

   }

  deleteStudent(studentId: number) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.result.then((confirmed) => {
      if (confirmed) {
    this.AdminService.deleteStudent(studentId)
      .subscribe({
        next: () => {
          // Remove from local array
          this.students = this.students.filter(s => s.studentId !== studentId);
          this.gridApi.setGridOption('rowData', this.students);
        
        this.toastr.success('Student deleted successfully!');
       
      },
      error:(err)=>{
    
        this.toastr.error(err.error[0].description, 'Failed to delete student');
  
      }
    });
  }
  }).catch(() => {});
  }



 
  onStudentGridReady(params: GridReadyEvent) 
  {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }

  editStudent(studentId: number) 
  {
    const student = this.students.find(s => s.studentId=== studentId);
    this.selectedStudent = student;
    this.showModal = true;
  }

  handleModalClose()
  {
      this.showModal = false;
      this.selectedStudent = null; // Clear selection 
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
