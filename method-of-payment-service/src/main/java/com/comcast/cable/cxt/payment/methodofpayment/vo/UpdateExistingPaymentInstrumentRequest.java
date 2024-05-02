package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateExistingPaymentInstrumentRequest {

    private String channel;
    private BillTo billTo;
    private String customerDefinedName;
    private String customerId;
    private CpcUpdateBankDetails bankDetails;
    private CpcUpdateCardDetails cardDetails;

    @Override
    public String toString() {
        return "UpdateExistingPaymentInstrumentRequest [channel=" + channel  + ", customerDefinedName=" + customerDefinedName  +
            ", billTo= " + billTo + ", customerId=" + customerId +"]";
    }
}
