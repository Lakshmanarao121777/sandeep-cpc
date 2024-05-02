package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WalletServiceUpdateRequest {

    private BillingInfo billingInfo;
    private String customerId;
    private BillTo billTo;
    private String customerDefinedName;
    private boolean defaultInstrument;
    private String expirationDate;

}
