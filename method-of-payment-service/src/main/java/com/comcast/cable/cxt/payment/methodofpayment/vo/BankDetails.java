package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BankDetails {
    private String encryptedAccountNumber;
    private String accountType;
    private String routingNumber;
}
