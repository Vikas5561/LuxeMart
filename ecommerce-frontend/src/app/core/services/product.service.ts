import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
    productId: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    category: any;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    brand: string;
    active: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:8080/api/products';

    constructor(private http: HttpClient) { }

    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    getProductsByCategory(category: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
    }

    searchProducts(query: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/search?q=${query}`);
    }

    filterProducts(filters: any): Observable<Product[]> {
        const params = new URLSearchParams();
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.minRating) params.append('minRating', filters.minRating);

        return this.http.get<Product[]>(`${this.apiUrl}/filter?${params.toString()}`);
    }

    getTopRatedProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/top-rated`);
    }

    getNewArrivals(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/new-arrivals`);
    }
}
