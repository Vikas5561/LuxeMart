import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/users';

    constructor(private http: HttpClient) { }

    getProfile(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/profile`, { withCredentials: true });
    }

    getAddresses(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/addresses`, { withCredentials: true });
    }

    addAddress(address: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/addresses`, address, { withCredentials: true });
    }
}
