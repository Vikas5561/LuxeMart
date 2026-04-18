# Frontend Setup Guide

## Requirements
- Node.js 18+ and npm
- Angular CLI 17

## Installation Steps

### 1. Install Node.js
Download and install from: https://nodejs.org/

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Angular CLI
```bash
npm install -g @angular/cli@17
```

Verify installation:
```bash
ng version
```

### 3. Install Dependencies

Navigate to frontend directory:
```bash
cd ecommerce-frontend
```

Install packages:
```bash
npm install
```

### 4. Run the Development Server

```bash
ng serve
```

Or:
```bash
npm start
```

The application will be available at: **http://localhost:4200**

### 5. Build for Production

```bash
ng build --configuration production
```

Output will be in `dist/ecommerce-frontend/`

## Project Structure

```
src/
├── app/
│   ├── core/                  # Core services and guards
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── cart.service.ts
│   │   │   └── order.service.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   └── interceptors/
│   │       └── http.interceptor.ts
│   ├── shared/                # Shared components
│   │   ├── header/
│   │   ├── footer/
│   │   ├── product-card/
│   │   └── loading-spinner/
│   └── features/              # Feature modules
│       ├── home/
│       ├── auth/
│       │   ├── login/
│       │   └── register/
│       ├── products/
│       │   ├── product-list/
│       │   └── product-detail/
│       ├── cart/
│       ├── checkout/
│       ├── orders/
│       └── admin/
│           ├──dashboard/
│           ├── product-management/
│           └── order-management/
├── assets/
├── styles.scss                # Global styles
└── index.html
```

## Key Features Implemented

### Services
- ✅ AuthService - User/Admin authentication
- ✅ ProductService - Product browsing and search
- ✅ CartService - Shopping cart management
- ✅ OrderService - Order placement and tracking

### Styling
- ✅ Modern design system with CSS variables
- ✅ Responsive grid system
- ✅ Button and form components
- ✅ Card components with hover effects
- ✅ Animations and transitions
- ✅ Loading spinners
- ✅ Badge components

### Design System
- Custom color palette (primary, secondary, accent)
- Typography scale
- Spacing system
- Shadow utilities
- Border radius utilities
- Transition utilities

## Environment Configuration

Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Create `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

## Next Steps

1. Complete component implementations
2. Add routing configuration
3. Implement guards for protected routes
4. Add HTTP interceptor for error handling
5. Create product listing page
6. Create product detail page
7. Implement shopping cart UI
8. Create checkout flow
9. Build admin dashboard
10. Add product management interface

## Development Tips

- Run `ng serve --open` to automatically open browser
- Use `ng generate component <name>` to create components
- Use `ng generate service <name>` to create services
- Run `ng lint` to check code quality
- Use Angular DevTools browser extension for debugging

## Troubleshooting

### Port Already in Use
```bash
ng serve --port 4300
```

### Module Not Found Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Ensure backend is running on port 8080
- Check that backend CORS configuration allows `http://localhost:4200`

## Resources

- Angular Documentation: https://angular.io/docs
- Angular Material: https://material.angular.io/
- RxJS Documentation: https://rxjs.dev/
