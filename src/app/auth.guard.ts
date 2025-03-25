import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { map, Observable } from 'rxjs';

export const authGuard: (allowedRoles?: number[]) => CanActivateFn = 
  (allowedRoles = [0,1,2]) => {
    return (route, state) => {
      const authService = inject(AuthService);
      const router = inject(Router);
      
      return authService.currentUser$.pipe(
        map(user => {
          // Check if user is authenticated
          if (!user) {
            return router.createUrlTree(['/login'], {
              queryParams: { returnUrl: state.url }
            });
          }

          // Check if user has required role
          if (!allowedRoles.includes(user.role)) {
            return router.createUrlTree(['/access-denied']);
          }

          return true;
        })
      );
    };
  };