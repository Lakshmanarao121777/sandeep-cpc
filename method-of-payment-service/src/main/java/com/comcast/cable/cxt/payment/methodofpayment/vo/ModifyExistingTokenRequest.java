package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModifyExistingTokenRequest {

    private BillTo billTo;
    private String customerDefinedName;
    private String customerId;
    private Boolean defaultInstrument;
    private String expirationDate;

    @Override
    public String toString() {
        return "ModifyExistingToken [billTo="  + billTo +
            ", customerDefinedName=" + customerDefinedName  +
            ", customerId=" + customerId +
            ", defaultInstrument=" + defaultInstrument +
            ", expirationDate=" + expirationDate +"]";
    }
}
