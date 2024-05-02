package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WalletBankDetails {

    private boolean defaultInstrument;
    private String customerDefinedName;
    private String token;
    private String paymentMode;
    private BillTo billTo;
    private String maskedAccountNumber;
    private String accountType;
    private String bankAccountLast4Digits;
    private String routingNumber;
    private String customerId;

}
