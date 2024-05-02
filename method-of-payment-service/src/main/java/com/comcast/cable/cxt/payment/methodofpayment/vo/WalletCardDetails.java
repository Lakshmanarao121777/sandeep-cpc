package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WalletCardDetails {

    private boolean defaultInstrument;
    private String customerDefinedName;
    private String token;
    private String paymentMode;
    private BillTo billTo;
    private String maskedCardNumber;
    private String cardType;
    private String expirationDate;
    private String maskedCvv;
    private String cardLast4Digits;
    private String customerId;

}
