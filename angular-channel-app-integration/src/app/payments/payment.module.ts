import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentDetailContainerComponent } from './payment-detail-container/payment-detail-container.component';

import { PaymentContainerComponent } from './payment-container';
import { ContinuePaymentButtonComponent } from './continue-payment-button/continue-payment-button';
import { PaymentReviewComponent } from './payment-review/payment-review.component';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { MinCardOnlyComponent } from './min-card-only/min-card-only.component';
import { MinAchOnlyComponent } from './min-ach-only/min-ach-only.component';
import { LazyElementsModule, LazyElementModuleRootOptions } from '@angular-extensions/elements';
import { PaymentService } from './payment.service';
import { CardOrBankComponent } from './card-or-bank/card-or-bank';
import { UpdatePaymentReviewComponent } from './update-payment-review/update-payment-review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const options: LazyElementModuleRootOptions = {
  rootOptions: {
    isModule: true
  },
  elementConfigs: [
    {
      tag: 'jump-web-component',
      url: 'https://common-payment.int.xfinity.com/1.0.0/jump/jump-web-component-bundle.js'
   // url: 'http://localhost:8081/jump/jump-web-component-bundle.js'
    }
  ]
};


@NgModule({
  declarations: [
    PaymentDetailContainerComponent,
    PaymentContainerComponent,
    ContinuePaymentButtonComponent,
    PaymentReviewComponent,
    PaymentSummaryComponent,
    PaymentDetailComponent,
    MinCardOnlyComponent,
    MinAchOnlyComponent,
    CardOrBankComponent,
    UpdatePaymentReviewComponent,
  ],
  imports: [
    CommonModule,
    //AppCommonModule,
    PaymentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LazyElementsModule.forRoot(options)
  ],
  providers:[
    PaymentService
  ],
  //bootstrap: [PaymentContainerComponent]
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PaymentModule {}
