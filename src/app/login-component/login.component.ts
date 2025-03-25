import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {adminRoutes} from '../routes/admin.routes'

@Component({
  selector: 'app-login',
  imports:[CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.warning('Please fill all required fields', 'Form Error');
      return;
    }
  
    this.loading = true;
    const credentials = this.loginForm.value;
  
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.toastr.success('Login successful!', 'Welcome');
        this.router.navigate([this.getRedirectPath(response.user.role)]);
      },
      error: (error) => {
        this.handleLoginError(error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
  private handleLoginError(error: any) {
    const errorMessage = this.getErrorMessage(error);
    this.toastr.error(errorMessage, 'Login Failed');
  }
  
  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Invalid email or password';
    }
    if (error.status === 0) {
      return 'Unable to connect to server';
    }
    return error.error?.message || 'An unexpected error occurred';
  }

  private getRedirectPath(role: number) {
    switch (role) {
      case 0 : return '/admin-dashboard';
      case 1: return '/teacher-dashboard'; //teacher
      case 2: return '/student-dashboard'; //student
      default: return '/';
    }
  }
}