package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutopayWithdrawServiceResponse {

    private String warning;
    private String result;
    private String debitDate;
    private String autoPayStatus;

}
