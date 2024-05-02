package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Bank {

    private String accountNumber;
    private String accountType;
    private BillTo billTo;
    private String checkNumber;
    private String customerDefinedName;
    private Boolean defaultInstrument;
    private String routingNumber;

}
