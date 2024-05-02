package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CpcAutopayResponse {
    private long autoPayId;
    private String debitDate;
}
