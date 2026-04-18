import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OfferService {
    private apiUrl = 'http://localhost:8080/api/offers';

    constructor(private http: HttpClient) { }

    getAllOffers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
    }

    getActiveOffers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/active`, { withCredentials: true });
    }

    createOffer(offer: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, offer, { withCredentials: true });
    }

    deleteOffer(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
    }
}
