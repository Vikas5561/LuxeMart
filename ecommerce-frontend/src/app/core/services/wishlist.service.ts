import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private apiUrl = 'http://localhost:8080/api/wishlist';

    constructor(private http: HttpClient) { }

    getWishlist(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
    }

    addToWishlist(productId: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/add?productId=${productId}`, {}, { withCredentials: true });
    }

    removeFromWishlist(productId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/remove?productId=${productId}`, { withCredentials: true });
    }

    checkInWishlist(productId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/check?productId=${productId}`, { withCredentials: true });
    }
}
