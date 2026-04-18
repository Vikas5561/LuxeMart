import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://localhost:8080/api/orders';

    constructor(private http: HttpClient) { }

    placeOrder(orderData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, orderData, { withCredentials: true });
    }

    getUserOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`, { withCredentials: true });
    }

    getOrderById(orderId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${orderId}`, { withCredentials: true });
    }

    cancelOrder(orderId: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${orderId}/cancel`, {}, { withCredentials: true });
    }

    downloadInvoice(orderId: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${orderId}/invoice`, {
            responseType: 'blob',
            withCredentials: true
        });
    }
}
