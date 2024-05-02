package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeleteExistingPaymentInstrumentResponse {

    private BillTo customerDetails;
    private SubmissionDetails submissionDetails;
    private CpcCardResponse cardDetails;
    private CpcBankResponse bankDetails;

}
