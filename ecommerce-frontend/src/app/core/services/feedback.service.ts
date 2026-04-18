import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Feedback {
    feedbackId?: number;
    orderId: number;
    customerId: string;
    customerName: string;
    description: string;
    rating: number;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private apiUrl = 'http://localhost:8080/api/feedback';

    constructor(private http: HttpClient) { }

    getAllFeedback(): Observable<Feedback[]> {
        return this.http.get<Feedback[]>(this.apiUrl, { withCredentials: true });
    }

    getFeedbackByRating(rating: number): Observable<Feedback[]> {
        return this.http.get<Feedback[]>(`${this.apiUrl}/rating/${rating}`, { withCredentials: true });
    }

    getFeedbackByOrder(orderId: number): Observable<Feedback[]> {
        return this.http.get<Feedback[]>(`${this.apiUrl}/order/${orderId}`, { withCredentials: true });
    }

    getFeedbackByCustomer(customerId: string): Observable<Feedback[]> {
        return this.http.get<Feedback[]>(`${this.apiUrl}/customer/${customerId}`, { withCredentials: true });
    }

    createFeedback(feedback: Feedback): Observable<Feedback> {
        return this.http.post<Feedback>(this.apiUrl, feedback, { withCredentials: true });
    }

    deleteFeedback(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
    }
}
