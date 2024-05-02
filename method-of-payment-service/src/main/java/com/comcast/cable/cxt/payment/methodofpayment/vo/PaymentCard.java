package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentCard {

    private BillTo billTo;
    private String cardNumber;
    private String cardType;
    private String customerDefinedName;
    private Boolean defaultInstrument;
    private String expirationDate;
    private String cvv;
    private String maskedInstrumentNumber;

}
