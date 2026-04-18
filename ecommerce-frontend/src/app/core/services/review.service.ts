import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private apiUrl = 'http://localhost:8080/api/reviews';

    constructor(private http: HttpClient) { }

    getProductReviews(productId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/product/${productId}`);
    }

    addReview(productId: number, rating: number, comment: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}?productId=${productId}&rating=${rating}&comment=${comment}`, {}, { withCredentials: true });
    }
}
