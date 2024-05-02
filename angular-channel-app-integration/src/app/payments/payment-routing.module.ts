import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentReviewComponent } from './payment-review/payment-review.component';
import { UpdatePaymentReviewComponent } from './update-payment-review/update-payment-review.component';

import { PaymentDetailContainerComponent } from './payment-detail-container/payment-detail-container.component';

const routes: Routes = [
  { path: '', component: PaymentDetailContainerComponent },
  { path: 'payment-review', component: PaymentReviewComponent },
  { path: 'update-payment-review', component: UpdatePaymentReviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
