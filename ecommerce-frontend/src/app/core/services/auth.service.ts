import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface AuthResponse {
    message: string;
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    customerId?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2?: string;
    zipCode: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';
    private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(true);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private http: HttpClient) {
        this.checkAuth();
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data, { withCredentials: true })
            .pipe(tap(response => this.currentUserSubject.next(response)));
    }

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data, { withCredentials: true })
            .pipe(tap(response => this.currentUserSubject.next(response)));
    }

    adminLogin(username: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/admin/login`,
            { username, password }, { withCredentials: true })
            .pipe(tap(response => this.currentUserSubject.next(response)));
    }

    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
            .pipe(
                tap(() => {
                    this.currentUserSubject.next(null);
                    localStorage.clear();
                    sessionStorage.clear();
                })
            );
    }

    checkAuth(): void {
        this.http.get<any>(`${this.apiUrl}/check`, { withCredentials: true })
            .subscribe({
                next: (response) => {
                    if (response.isLoggedIn) {
                        this.currentUserSubject.next(response);
                    }
                    this.loadingSubject.next(false);
                },
                error: () => {
                    this.currentUserSubject.next(null);
                    this.loadingSubject.next(false);
                }
            });
    }

    isAuthenticated(): Observable<boolean> {
        return this.currentUserSubject.asObservable().pipe(
            map(user => user !== null)
        );
    }

    isLoggedIn(): boolean {
        return this.currentUserSubject.value !== null;
    }

    isAdmin(): boolean {
        return this.currentUserSubject.value?.userType === 'ADMIN';
    }

    getCurrentUser(): AuthResponse | null {
        return this.currentUserSubject.value;
    }
}
