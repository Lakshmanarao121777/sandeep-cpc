package com.comcast.cable.cxt.payment.paymentContract.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRecordContractRequest {
    private String channel;
    private String termsType;
    private String accountNumber;
    private String customerGuid;
}
