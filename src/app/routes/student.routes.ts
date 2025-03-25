import { Routes } from '@angular/router';
import { StudentDashboardComponent } from '../student-dashboard/student-dashboard.component'
import { StudentDetailsComponent } from '../student-dashboard/student-details/student-details.component';


// import { UserFormComponent } from './users/user-form/user-form.component';

export const studentRoutes: Routes = [
  {
    path: '',
    component: StudentDashboardComponent,
    children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' },
       { path: 'details', component: StudentDetailsComponent },
      // { path: 'teachers', component: TeacherRecordsComponent },
    //   { path: 'students/new', component: UserFormComponent, data: { role: 'student' } },
    //   { path: 'teachers/new', component: UserFormComponent, data: { role: 'teacher' } },
    //   { path: 'students/edit/:id', component: UserFormComponent, data: { role: 'student' } },
    //   { path: 'teachers/edit/:id', component: UserFormComponent, data: { role: 'teacher' } },
    //   { path: '', redirectTo: 'students', pathMatch: 'full' }
    ]
  }
];