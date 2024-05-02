import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: '/payment-detail', pathMatch: 'full' },
  {
    path: 'payment-detail',
    loadChildren: () => import('./payments/payment.module').then(m => m.PaymentModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
