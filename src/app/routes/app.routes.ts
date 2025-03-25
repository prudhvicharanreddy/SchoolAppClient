import { Routes } from '@angular/router';
import { LoginComponent } from '../login-component/login.component';
import { authGuard } from '../auth.guard';
 export const routes: Routes = [{
    path: 'admin-dashboard',
    canActivate: [authGuard([0])],
    loadChildren: () => import('./admin.routes').then(m => m.adminRoutes)
  },
//   {
//     path: 'teacher',
//     canActivate: [roleGuard(['teacher'])],
//     loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule)
//   },
  {
    path: 'student-dashboard',
    canActivate: [authGuard([2])],
    loadChildren: () => import('./student.routes').then(m => m.studentRoutes)
  },
 
   
{path: 'login', component: LoginComponent },
{ path: '', redirectTo: 'login', pathMatch: 'full'
 }];
