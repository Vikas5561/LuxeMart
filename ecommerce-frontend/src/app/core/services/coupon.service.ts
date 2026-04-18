import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CouponService {
    private apiUrl = 'http://localhost:8080/api/coupons';

    constructor(private http: HttpClient) { }

    getActiveCoupons(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/active`);
    }

    validateCoupon(code: string, orderAmount: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/validate?code=${code}&orderAmount=${orderAmount}`, {}, { withCredentials: true });
    }
}
