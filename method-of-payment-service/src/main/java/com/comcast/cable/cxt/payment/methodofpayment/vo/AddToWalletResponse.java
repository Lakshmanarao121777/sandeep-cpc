package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddToWalletResponse {

    private String customerId;
    private Name customerDetails;
    private SubmissionDetails submissionDetails;
    private CpcCardResponse cardDetails;
    private CpcBankResponse bankDetails;
    private CpcAutopayResponse autopayDetails;
    private PaymentRecordContractResponse contractDetails;
}
