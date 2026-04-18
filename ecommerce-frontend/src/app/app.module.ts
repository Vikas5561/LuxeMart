import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { ProductListComponent } from './features/products/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { AdminLoginComponent } from './features/auth/admin-login.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { PaymentComponent } from './features/payment/payment.component';
import { OrderConfirmationComponent } from './features/order/order-confirmation.component';
import { OrderHistoryComponent } from './features/order/order-history.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { CustomerHomeComponent } from './features/customer/customer-home.component';
import { AdminLayoutComponent } from './features/admin/admin-layout.component';
import { AddProductComponent } from './features/admin/add-product.component';
import { ViewProductsComponent } from './features/admin/view-products.component';
import { UpdateProductComponent } from './features/admin/update-product.component';
import { ViewCustomersComponent } from './features/admin/view-customers.component';
import { ViewOrdersComponent } from './features/admin/view-orders.component';
import { ViewFeedbackComponent } from './features/admin/view-feedback.component';
import { CustomerProfileComponent } from './features/customer/customer-profile.component';

import { ViewOffersComponent } from './features/admin/view-offers.component';
import { AddOfferComponent } from './features/admin/add-offer.component';
import { ToastComponent } from './shared/components/toast/toast.component';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin/login', component: AdminLoginComponent },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'products/add', component: AddProductComponent },
            { path: 'products/update', component: UpdateProductComponent },
            { path: 'products', component: ViewProductsComponent },
            { path: 'customers', component: ViewCustomersComponent },
            { path: 'orders', component: ViewOrdersComponent },
            { path: 'feedback', component: ViewFeedbackComponent },
            { path: 'orders/status', component: ViewOrdersComponent },
            { path: 'offers', component: ViewOffersComponent },
            { path: 'offers/add', component: AddOfferComponent }
        ]
    },
    { path: 'customer/home', component: CustomerHomeComponent, canActivate: [AuthGuard] },
    { path: 'customer/cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'customer/orders', component: OrderHistoryComponent, canActivate: [AuthGuard] },
    { path: 'customer/profile', component: CustomerProfileComponent, canActivate: [AuthGuard] },
    { path: 'customer/checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
    { path: 'customer/payment', component: PaymentComponent, canActivate: [AuthGuard] },
    { path: 'customer/order-confirmation', component: OrderConfirmationComponent, canActivate: [AuthGuard] },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
    { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
    { path: 'order-confirmation', component: OrderConfirmationComponent, canActivate: [AuthGuard] },
    { path: 'orders', component: OrderHistoryComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ProductListComponent,
        ProductDetailComponent,
        LoginComponent,
        RegisterComponent,
        AdminLoginComponent,
        CartComponent,
        CheckoutComponent,
        PaymentComponent,
        OrderConfirmationComponent,
        OrderHistoryComponent,
        AdminDashboardComponent,
        CustomerHomeComponent,
        AdminLayoutComponent,
        AddProductComponent,
        ViewProductsComponent,
        UpdateProductComponent,
        ViewCustomersComponent,
        ViewOrdersComponent,
        ViewFeedbackComponent,
        CustomerProfileComponent,
        ViewOffersComponent,
        CustomerProfileComponent,
        ViewOffersComponent,
        AddOfferComponent,
        ToastComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
