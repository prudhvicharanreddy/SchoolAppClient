import { Routes } from '@angular/router';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { StudentRecordsComponent } from '../admin-dashboard/student-records/student-records.component';
import { TeacherRecordsComponent } from '../admin-dashboard/teacher-records/teacher-records.component'
// import { UserFormComponent } from './users/user-form/user-form.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'students', pathMatch: 'full' },
       { path: 'students', component: StudentRecordsComponent },
      { path: 'teachers', component: TeacherRecordsComponent },
     
    //   { path: 'students/new', component: UserFormComponent, data: { role: 'student' } },
    //   { path: 'teachers/new', component: UserFormComponent, data: { role: 'teacher' } },
    //   { path: 'students/edit/:id', component: UserFormComponent, data: { role: 'student' } },
    //   { path: 'teachers/edit/:id', component: UserFormComponent, data: { role: 'teacher' } },
    //   { path: '', redirectTo: 'students', pathMatch: 'full' }
    ]
  }
];