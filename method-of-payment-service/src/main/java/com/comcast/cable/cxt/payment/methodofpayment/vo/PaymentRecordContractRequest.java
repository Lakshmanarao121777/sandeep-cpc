package com.comcast.cable.cxt.payment.methodofpayment.vo;

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
