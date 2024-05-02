package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AddInstrumentToWallet {
    private String customerDefinedName;
    private Boolean defaultInstrument;
}
