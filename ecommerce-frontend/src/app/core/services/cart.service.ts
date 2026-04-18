import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Cart {
    cartId: number;
    user: any;
    items: CartItem[];
    totalPrice: number;
    couponCode?: string;
    discountAmount?: number;
}

export interface CartItem {
    cartItemId: number;
    product: any;
    quantity: number;
    price: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = 'http://localhost:8080/api/cart';
    private cartSubject = new BehaviorSubject<Cart | null>(null);
    public cart$ = this.cartSubject.asObservable();

    constructor(private http: HttpClient) { }

    getCart(): Observable<Cart> {
        return this.http.get<Cart>(this.apiUrl, { withCredentials: true })
            .pipe(tap(cart => this.cartSubject.next(cart)));
    }

    addToCart(productId: number, quantity: number): Observable<Cart> {
        return this.http.post<Cart>(`${this.apiUrl}/add`,
            { productId, quantity },
            { withCredentials: true }
        ).pipe(tap(cart => this.cartSubject.next(cart)));
    }

    updateCartItem(itemId: number, quantity: number): Observable<Cart> {
        return this.http.put<Cart>(`${this.apiUrl}/update/${itemId}?quantity=${quantity}`,
            {},
            { withCredentials: true }
        ).pipe(tap(cart => this.cartSubject.next(cart)));
    }

    removeFromCart(itemId: number): Observable<Cart> {
        return this.http.delete<Cart>(`${this.apiUrl}/remove/${itemId}`,
            { withCredentials: true }
        ).pipe(tap(cart => this.cartSubject.next(cart)));
    }

    clearCart(): Observable<any> {
        return this.http.delete(`${this.apiUrl}/clear`, { withCredentials: true })
            .pipe(tap(() => this.cartSubject.next(null)));
    }

    getCartItemCount(): number {
        const cart = this.cartSubject.value;
        return cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    }
}
