import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, take, filter, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        // Wait for the initial auth check to complete (loading$ becomes false)
        return this.authService.loading$.pipe(
            filter(loading => !loading),
            take(1),
            switchMap(() => this.authService.isAuthenticated()),
            take(1),
            map(isAuthenticated => {
                if (isAuthenticated) {
                    return true;
                }

                // Redirect to login page
                // Check if it's an admin route to redirect to admin login
                if (state.url.startsWith('/admin')) {
                    this.router.navigate(['/admin/login']);
                } else {
                    this.router.navigate(['/login']);
                }
                return false;
            })
        );
    }
}
